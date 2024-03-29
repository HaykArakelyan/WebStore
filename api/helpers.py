from hashlib import sha256

from flask_jwt_extended import decode_token, get_jwt_identity

from models import User


def generate_hash(st):
    return sha256(st.encode('utf-8')).hexdigest()


def jwt_decoder(token):
    return decode_token(token, allow_expired=True)

def get_user():
    user_email = get_jwt_identity()[0]
    user = User.query.filter_by(email=user_email).first()
    return user

