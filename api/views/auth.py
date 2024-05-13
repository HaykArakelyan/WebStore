from datetime import datetime

from flask import request, render_template, jsonify
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, create_refresh_token, verify_jwt_in_request, \
    get_jwt_identity
import constants
from app import app, login_manager, jwt
from helpers import generate_verification_token, send_verification_email, generate_hash, reset_password_email, is_valid_password
from models import User, db
import re

@app.route('/', methods=['GET'])
def index():
    return 'it works correctly!!!!'


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route('/login', methods=['POST', 'GET'])
@cross_origin(supports_credentials=True)
def login():
    if request.method == "POST":
        data = request.json
        email = data['email']
        password = data['password']
        user = User.query.filter_by(
            email=email, password=generate_hash(password)).first()

        if not email or not password:
            return jsonify(message=constants.ErrorMessages.missing_credentials), 400
        if not user:
            return jsonify(message=constants.ErrorMessages.invalid_credentials), 401
        if user.verification_token:
            return jsonify(message='Verify Your Email First'), 401

        access_token = create_access_token(identity=[email])
        refresh_token = create_refresh_token(identity=[email])
        return jsonify(access_token=access_token, refresh_token=refresh_token, id=user.id, message="Login Successful"), 200

    return jsonify(message='Method Not Allowed'), 405


@app.route('/register', methods=["POST"])
def register_user():
    if request.method == "POST":
        data = request.json
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        phone = data.get('phone')
        gender = data.get('gender')
        age = data.get('age')
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        if not all([first_name, last_name, gender, email, phone, password, age, confirm_password]):
            missing_fields = [field for field, value in {
                'first_name': first_name,
                'last_name': last_name,
                'gender': gender,
                'email': email,
                'phone': phone,
                'password': password,
                'age': age,
                'confirm_password': confirm_password
            }.items() if not value]

            return jsonify(
                message=constants.ErrorMessages.missing_required_fields.format(', '.join(missing_fields))), 400

        if not re.match(constants.EMAIL_REGEX, email):
            return jsonify(message=constants.ErrorMessages.email_invalid), 400

        if User.query.filter_by(email=email).first():
            return jsonify(message=constants.ErrorMessages.email_exist), 400

        if not is_valid_password(password):
            return jsonify(message=constants.ErrorMessages.password_length), 400

        if not any(char in password for char in constants.ALLOWED_CHARACTERS_IN_PASSWORD):
            return jsonify(message=constants.ErrorMessages.password_chars), 400

        if password != confirm_password:
            return jsonify(message=constants.ErrorMessages.password_match), 400

        user = User(first_name=first_name,
                    last_name=last_name,
                    email=email,
                    phone=phone,
                    gender=gender,
                    age=age,
                    password=generate_hash(password),
                    registered_at=datetime.now().strftime("%Y-%m-%d"),
                    verification_token=generate_verification_token(),
                    reset_password_token=generate_verification_token()
                    )
        db.session.add(user)
        db.session.commit()
        send_verification_email(user.email, user.verification_token, user.first_name)
        return jsonify(message=constants.successMessages.success_register), 200
    else:
        return jsonify(message='Method Not Allowed'), 405


@app.route('/verify_email', methods=['GET'])
def verify_email():
    token = request.args.get('token')
    if not token:
        return render_template('verifyEmail/error/verifyEmail.html')

    user = User.query.filter_by(verification_token=token).first()
    if not user:
        return render_template('verifyEmail/error/verifyEmail.html')

    user.verification_token = None
    db.session.commit()

    return render_template('verifyEmail/success/verifyEmail.html')


@app.route('/recover_password', methods=['POST'])
def recover_password():
    if request.method == 'POST':
        data = request.json

        email = data.get("email")
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify(message="User Not Found"), 404

        reset_password_email(email, user.reset_password_token, user.first_name)
        return jsonify(message='Password Reset Email is Sent.'), 200


@app.route('/reset_password', methods=['GET', 'POST'])
def reset_password():
    if request.method == 'GET':
        token = request.args.get('token')

        if not token:
            return render_template('ResetPassword/error/resetPassword.html', error="Invalid Token")

        user = User.query.filter_by(reset_password_token=token).first()
        if not user:
            return render_template('ResetPassword/error/resetPassword.html', error="User Not Found")

        return render_template('ResetPassword/resetPassword.html', token=token)

    elif request.method == 'POST':
        token = request.form.get('token')
        new_password = request.form.get('password')
        confirm_password = request.form.get('confirmPassword')

        if not token:
            return render_template('ResetPassword/error/resetPassword.html', error="Invalid Token")

        user = User.query.filter_by(reset_password_token=token).first()
        if not user:
            return render_template('ResetPassword/error/resetPassword.html', error="User Not Found")

        if not new_password or not confirm_password or new_password != confirm_password:
            return render_template('ResetPassword/error/resetPassword.html', error="Passwords do not match.")

        if len(new_password) < 6:
            return render_template('ResetPassword/error/resetPassword.html',
                                   error="Password Must Have at Least 6 Character Length")

        user.password = generate_hash(new_password)
        user.reset_password_token = generate_verification_token()
        db.session.commit()

        return render_template('ResetPassword/success/resetPassword.html',
                               success="Password is Reset Successfully. You Can Now Login With Your New Password")


# TODO update logout
BLOCKLIST = set()


@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    BLOCKLIST.add(jti)
    return {"message": "Successfully Logged Out"}, 200


@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    return jti in BLOCKLIST


@app.route('/refresh_token', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        verify_jwt_in_request(refresh=True)
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)
        return jsonify(access_token=access_token), 200
    except:
        return jsonify(message="Refresh Token is Invalid or Expired"), 401
