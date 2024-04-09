import os
from hashlib import sha256

import boto3
from dotenv import load_dotenv
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


def create_session():
    load_dotenv()

    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_SESSION_TOKEN = os.getenv('AWS_SESSION_TOKEN')

    session = boto3.Session(
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        aws_session_token=AWS_SESSION_TOKEN
    )

    return session
