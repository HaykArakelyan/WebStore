import base64
import hashlib
import os
import secrets
from hashlib import sha256

import boto3
import resend
from dotenv import load_dotenv
from flask import jsonify
from flask_jwt_extended import decode_token, get_jwt_identity

from models import User, ProductImage, db



def send_verification_email(email, token, user_firstname):
    load_dotenv()
    resend.api_key = os.environ["RESEND_API_KEY"]
    verification_link = f"http://localhost:5000/verify_email?token={token}"
    params = {"from": "contact.us.capstone@spiffyzone.online",
              "to": [email],
              "subject": "Verify Your Email Address",
              "html": create_html_content(verification_link, user_firstname),
              }
    r = resend.Emails.send(params)
    return jsonify(r)

def create_html_content(verification_link, user_firstname):
    html_content = f"""
        <html>
            <head></head>
            <body>
                <p>Dear <strong>{user_firstname}</strong>,</p>
                <p>Please click the following link to verify your email address:</p>
                <p><a href="{verification_link}">{verification_link}</a></p>
                <p>If you didn't request this verification, you can safely ignore this email.</p>
                <p>Best regards,<br/>Spiffzone Advertisment Company</p>
            </body>
        </html>
        """
    return html_content

def generate_verification_token():
    return secrets.token_urlsafe(16)


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

    AWS_ACCESS_KEY_ID = os.environ["AWS_ACCESS_KEY_ID"]
    AWS_SECRET_ACCESS_KEY = os.environ["AWS_SECRET_ACCESS_KEY"]

    session = boto3.Session(
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    )

    return session


def hash_user_id(user_id):
    return hashlib.sha256(str(user_id).encode('utf-8')).hexdigest()

def hash_product_id(product_id):
    return hashlib.sha256(str(product_id).encode('utf-8')).hexdigest()
def decode_images(img_string):
    return base64.b64decode(img_string)


def upload_product_images(product, user, list_data):
    s3_client = create_session().client('s3')
    for i, img in enumerate(list_data):
        decoded_image = decode_images(img)
        user_hash = hash_user_id(user.id)
        product_hash = hash_product_id(product.product_id)
        s3_key = f"images/{user_hash}/products/{product_hash}/product_image_{product.product_id}_{i}.png"
        s3_client.put_object(Bucket=os.environ['S3_BUCKET_NAME'], Key=s3_key, Body=decoded_image,
                             ContentType='image/png')

        product_image_url = f"{os.environ['DOMAIN_NAME'] }/{s3_key}"

        new_product_image = ProductImage(product_id=product.product_id, img_path=product_image_url)
        db.session.add(new_product_image)


def delete_objects_in_folder(bucket_name, folder_prefix):
    s3 = create_session().client('s3')
    objects_to_delete = []
    paginator = s3.get_paginator('list_objects_v2')
    for page in paginator.paginate(Bucket=bucket_name, Prefix=folder_prefix):
        if 'Contents' in page:
            for obj in page['Contents']:
                objects_to_delete.append({'Key': obj['Key']})
    if objects_to_delete:
        s3.delete_objects(Bucket=bucket_name, Delete={'Objects': objects_to_delete})