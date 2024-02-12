from hashlib import sha256

from flask_jwt_extended import decode_token


def generate_hash(st):
    return sha256(st.encode('utf-8')).hexdigest()


def jwt_decoder(token):
    return decode_token(token, allow_expired=True)


