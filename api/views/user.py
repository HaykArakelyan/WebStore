import base64
import hashlib
import os
from hashlib import sha256

from flask import request, jsonify
from flask_jwt_extended import jwt_required

import helpers
from app import app
from helpers import get_user
from models import db, Product, UserProduct, ProfileImages, Cart, ProductImage, Review


@app.route('/user_profile', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def get_user_by_id():
    user = get_user()
    if request.method == 'GET':
        if user:
            user_products = Product.query.filter_by(owner_id=user.id).all()
            products_info = [product.product_to_dict() for product in user_products]

            user_cart_products = db.session.query(Cart).join(UserProduct).filter(UserProduct.user_id == user.id).all()
            cart_products_info = []
            for cart_item in user_cart_products:
                user_product = UserProduct.query.get(cart_item.user_prod_id)
                product = Product.query.get(user_product.product_id)
                cart_product_info = product.product_to_dict()

                user_prods = UserProduct.query.filter_by(product_id=product.product_id).all()
                user_prod_ids = [user_prod.user_prod_id for user_prod in user_prods]
                reviews = Review.query.filter(Review.user_prod_id.in_(user_prod_ids)).all()
                cart_product_info["reviews"] = [review.review_to_dict() for review in reviews]

                prod_images = ProductImage.query.filter_by(product_id=product.product_id).all()
                prod_images_dict = [img.image_path() for img in prod_images]
                cart_product_info["images"] = prod_images_dict

                cart_products_info.append(cart_product_info)

            for product_info in products_info:
                product_id = product_info["product_id"]
                user_prods = UserProduct.query.filter_by(product_id=product_id).all()
                user_prod_ids = [user_prod.user_prod_id for user_prod in user_prods]
                reviews = Review.query.filter(Review.user_prod_id.in_(user_prod_ids)).all()
                product_info["reviews"] = [review.review_to_dict() for review in reviews]

                prod_images = ProductImage.query.filter_by(product_id=product_id).all()
                prod_images_dict = [img.image_path() for img in prod_images]
                product_info["images"] = prod_images_dict

            user_info = user.user_to_dict()
            profile_image_obj = ProfileImages.query.filter_by(user_id=user.id).first()
            if profile_image_obj:
                profile_image = profile_image_obj.get_image_path()
                user_info = {**user_info, **profile_image, "user_id": sha256(str(user.id).encode('utf-8')).hexdigest()}
            return jsonify(
                {'user_info': user_info, 'products_info': products_info, "cart_products_info": cart_products_info}), 200
        else:
            return jsonify(message="User Not Found"), 404
    elif request.method == 'PUT':
        data = request.json
        new_first_name = data.get('first_name')
        new_last_name = data.get('last_name')
        new_email = data.get('email')
        new_phone = data.get('phone')
        new_gender = data.get('gender')
        profile_image_base64 = data.get("profile_image_base64")

        if not data:
            return jsonify(message='Bad Request'), 400

        if not user:
            return jsonify(message='User Not Found'), 404

        user.first_name = new_first_name
        user.last_name = new_last_name
        user.email = new_email
        user.phone = new_phone
        user.gender = new_gender

        if profile_image_base64:
            s3 = helpers.create_session().resource('s3')
            profile_image_data = base64.b64decode(profile_image_base64)
            s3_key = f"images/{sha256(str(user.id).encode('utf-8')).hexdigest()}/avatar/profile_image.png"
            s3.Object(os.getenv('S3_BUCKET_NAME'), s3_key).put(Body=profile_image_data, ContentType='image/png')
            profile_image_public_url = f"{os.getenv('DOMAIN_NAME')}/images/{sha256(str(user.id).encode('utf-8')).hexdigest()}/avatar/profile_image.png"
            profile_image = ProfileImages.query.filter_by(user_id=user.id).first()
            if profile_image:
                profile_image.image_path = profile_image_public_url
            else:
                new_profile_image = ProfileImages(user_id=user.id, image_path=profile_image_public_url)
                db.session.add(new_profile_image)
        db.session.commit()
        return jsonify({'message': 'User Info Updated Successfully'}), 200
    elif request.method == 'DELETE':
        if user:
            user_profile_img = ProfileImages.query.filter_by(user_id=user.id).first()

            if user_profile_img:
                db.session.delete(user_profile_img)
            user_products = Product.query.filter_by(owner_id=user.id).all()
            user_prod_ids = [user_prod.user_prod_id for user_prod in UserProduct.query.filter_by(user_id=user.id).all()]
            Review.query.filter(Review.user_prod_id.in_(user_prod_ids)).delete(synchronize_session=False)
            user_prod_ids_in_cart = [cart_item.user_prod_id for cart_item in
                                     Cart.query.filter(Cart.user_prod_id.in_(user_prod_ids)).all()]
            Cart.query.filter(Cart.user_prod_id.in_(user_prod_ids_in_cart)).delete(synchronize_session=False)
            UserProduct.query.filter(UserProduct.user_prod_id.in_(user_prod_ids_in_cart)).delete(
                synchronize_session=False)

            for product in user_products:
                product_images = ProductImage.query.filter_by(product_id=product.product_id).all()
                for image in product_images:
                    db.session.delete(image)
                db.session.delete(product)
            db.session.delete(user)
            db.session.commit()
            user_hash = hashlib.sha256(str(user.id).encode('utf-8')).hexdigest()
            s3_folder_prefix = f"images/{user_hash}"
            helpers.delete_objects_in_folder(os.getenv('S3_BUCKET_NAME'), s3_folder_prefix)
            return jsonify({'message': 'User and Associated Data Deleted Successfully'}), 200
        else:
            return jsonify({'message': 'User Not Found'}), 404

    return jsonify(message='Bad Request'), 400
