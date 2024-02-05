from datetime import datetime

from flask import request, jsonify
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token, jwt_required

from app import app, login_manager
from helpers import generate_hash
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
        if user:
            access_token = create_access_token(identity=[email])
            return jsonify(access_token=access_token, id=user.id), 200
        else:
            return jsonify(message='Invalid username or password'), 401
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
                            registered_at=datetime.now().strftime("%Y-%m-%d")
                            )
                db.session.add(user)
                db.session.commit()
                return jsonify(message='Successfully registered'), 200
            return jsonify(message='bad request'), 400
        return jsonify(message='Method Not Allowed'), 405


