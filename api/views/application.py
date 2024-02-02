from datetime import datetime

from flask import request, jsonify
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token, jwt_required

from app import app, login_manager
from helpers import generate_hash
from models import User, db


@app.route('/user_profile/<user_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def get_course_by_id(user_id):
    if request.method == 'GET':
        user = User.query.filter_by(id=user_id).first()
        if user:
            return jsonify(User.user_to_dict(user)), 200
        else:
            return jsonify(message="User not found"), 404
    elif request.method == 'PUT':
        data = request.json
        new_first_name = data.get('first_name')
        new_last_name = data.get('last_name')
        new_email = data.get('email')
        new_phone = data.get('phone')
        if data:
            user = User.query.filter_by(id=user_id).first()
            if user:
                user.first_name = new_first_name
                user.last_name = new_last_name
                user.email = new_email
                user.phone = new_phone
                db.session.commit()
                return jsonify({'message': 'User info updated successfully'}), 200
            return jsonify(message='User not found'), 404
        return jsonify(message='Bad request'), 400
    elif request.method == 'DELETE':
        user = User.query.filter_by(id=user_id).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            return jsonify({'message': 'User deleted successfully'}), 200
        return jsonify(message='User not found'), 404
    return jsonify(message='Bad request'), 400

