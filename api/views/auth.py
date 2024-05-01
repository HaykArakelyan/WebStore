from datetime import datetime

from flask import request, jsonify, redirect, url_for, render_template
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, create_refresh_token, verify_jwt_in_request, get_jwt_identity
from werkzeug.security import generate_password_hash


from app import app, login_manager, jwt
from helpers import generate_verification_token, send_verification_email, generate_hash, reset_password_email
from models import User, db


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


        if not user:
            return jsonify(message='Invalid username or password'), 401
        #TODO Error handling from frontend
        if user.verification_token:
            return jsonify(message='Verify your email'), 401

        access_token = create_access_token(identity=[email])
        refresh_token = create_refresh_token(identity=[email])
        return jsonify(access_token=access_token, refresh_token=refresh_token, id=user.id), 200


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
        if first_name and last_name and gender and email and phone and password and age:
            if not User.query.filter_by(email=email).first():
                user = User(first_name=first_name,
                            last_name=last_name,
                            email=email,
                            phone=phone,
                            gender=gender,
                            age=age,
                            password=generate_hash(password),
                            balance=100000,
                            registered_at=datetime.now().strftime("%Y-%m-%d"),
                            verification_token=generate_verification_token(),
                            reset_password_token=generate_verification_token()
                            )
                db.session.add(user)
                db.session.commit()
                send_verification_email(user.email, user.verification_token, user.first_name)
                return jsonify(message='User registered. Verification email sent.'), 200
            return jsonify(message='bad request'), 400
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
        # if not data or 'email' not in data:
        #     return jsonify(message="Invalid request. Email is missing."), 400

        email = data.get("email")
        print(email)
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify(message="User not found"), 404

        reset_password_email(email, user.reset_password_token, user.first_name)
        return jsonify(message='Password reset email sent.'), 200

@app.route('/handle_password_reset', methods=['GET', 'POST'])
def reset_password():
    if request.method == 'GET':
        token = request.args.get('token')
        print("Received token:", token)

        if not token:
            return jsonify(message="Invalid Token"), 400

        user = User.query.filter_by(reset_password_token=token).first()
        if not user:
            return jsonify(message="User not found"), 400

        return render_template('ResetPassword/resetPassword.html', token=token)

    elif request.method == 'POST':
        token = request.form.get('token')
        new_password = request.form.get('password')
        confirm_password = request.form.get('confirmPassword')

        if not token:
            return jsonify(message="Invalid Token"), 400

        user = User.query.filter_by(reset_password_token=token).first()
        if not user:
            return jsonify(message="User not found"), 400

        # Validate that both passwords are not empty and match
        if not new_password or not confirm_password or new_password != confirm_password:
            return jsonify(message="Passwords do not match."), 400

        # Validate the length of the new password
        if len(new_password) < 6:
            return jsonify(message="Password must be at least 6 characters long."), 400

        # Update the user's password and clear the reset password token
        user.password = generate_hash(new_password)
        user.reset_password_token = None
        db.session.commit()

        return jsonify(message='Password reset successfully. You can now login with your new password.')



#TODO update logout
BLOCKLIST=set()
@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    BLOCKLIST.add(jti)
    return {"message": "Successfully logged out"}, 200

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
        return jsonify(message="Refresh token is invalid or expired"), 401