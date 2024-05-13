import os
from datetime import datetime

from flask import request, jsonify
from flask_jwt_extended import jwt_required

import helpers
from app import app
from helpers import get_user
from models import User, db, Product, UserProduct, ProfileImages, ProductImage, Review, UserRates



@app.route('/add_product', methods=['POST'])
@jwt_required()
def add_product():
    if request.method == "POST":
        data = request.json
        user = get_user()

        if not user:
            return jsonify(message="User Not Found"), 404

        if not data:
            return jsonify(message="No Data Provided"), 400

        title = data.get("title")
        discount_percentage = data.get("discountPercentage")
        stock = data.get("stock")
        brand = data.get("brand")
        category = data.get("category")
        description = data.get("description")
        price = data.get("price")

        list_data = data.get("images")
        product = Product(
            title=title,
            discountPercentage=discount_percentage,
            stock=stock,
            brand=brand,
            category=category,
            description=description,
            price=price,
            owner_id=user.id
        )
        db.session.add(product)
        db.session.commit()
        if list_data:
            helpers.upload_product_images(product, user, list_data)
        db.session.commit()
        return jsonify(message="Product And Images Added Successfully"), 200



@app.route('/edit_product/<int:product_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def edit_product(product_id):
    user = get_user()
    if not user:
        return jsonify(message="You are Not Authorized to Edit This Product"), 403
    if request.method == 'PUT':
        data = request.json
        if not data:
            return jsonify(message="No Data Provided"), 400

        product = Product.query.get(product_id)
        if not product:
            return jsonify(message="Product Not Found"), 404

        user_product = Product.query.filter_by(product_id=product_id, owner_id=user.id).first()
        if not user_product:
            return jsonify(message="User Not Found"), 404

        product.title = data.get("title", product.title)
        product.discountPercentage = data.get("discountPercentage", product.discountPercentage)
        product.stock = data.get("stock", product.stock)
        product.brand = data.get("brand", product.brand)
        product.category = data.get("category", product.category)
        product.description = data.get("description", product.description)
        product.price = data.get("price", product.price)
        db.session.commit()
        list_data = data.get("images")
        if list_data is not None:
            user_hash = helpers.hash_user_id(user.id)
            product_hash = helpers.hash_product_id(product.product_id)
            s3_folder_prefix = f"images/{user_hash}/products/{product_hash}"
            helpers.delete_objects_in_folder(os.getenv('S3_BUCKET_NAME'), s3_folder_prefix)
            delete_iamges = ProductImage.query.filter_by(product_id=product.product_id).all()

            for i in delete_iamges:
                db.session.delete(i)
            helpers.upload_product_images(product, user, list_data)

            db.session.commit()
        return jsonify(message="Product Updated Successfully"), 200

    elif request.method == 'DELETE':
        product = Product.query.get(product_id)
        if not product:
            return jsonify(message="Product Not Found"), 404
        UserProduct.query.filter_by(product_id=product_id).delete()
        db.session.commit()

        db.session.delete(product)
        db.session.commit()
        user_hash = helpers.hash_user_id(user.id)
        product_hash = helpers.hash_product_id(product.product_id)
        s3_folder_prefix = f"images/{user_hash}/products/{product_hash}"
        helpers.delete_objects_in_folder(os.getenv('S3_BUCKET_NAME'), s3_folder_prefix)
        return jsonify(message="Product Deleted Successfully"), 200
    else:
        return jsonify(message="Invalid Request Method"), 405


@app.route('/products', methods=['GET'])
def get_all_products():
    products_list = []

    products = Product.query.all()

    if not products:
        return jsonify(message="Products Not Found"), 404

    for product in products:
        product_info = product.product_to_dict()

        prod_images = ProductImage.query.filter_by(product_id=product.product_id).all()
        prod_images_dict = [img.image_path() for img in prod_images]

        user_prods = UserProduct.query.filter_by(product_id=product.product_id).all()
        user_prod_ids = [user_prod.user_prod_id for user_prod in user_prods]

        reviews = Review.query.filter(Review.user_prod_id.in_(user_prod_ids)).all()

        product_info["reviews"] = [review.review_to_dict() for review in reviews]
        product_info["images"] = prod_images_dict

        products_list.append(product_info)

    return jsonify({'products': products_list}), 200


@app.route('/get_products')
@jwt_required()
def get_products():
    user = get_user()
    if not user:
        return jsonify(message="User Not Found"), 404
    user_products = Product.query.filter_by(owner_id=user.id).all()
    product_ids = [user_prod.product_id for user_prod in user_products]
    products = Product.query.filter(Product.product_id.in_(product_ids)).all()

    products_list = [product.product_to_dict() for product in products]

    for product in products_list:
        product_id = product["product_id"]
        user_prods = UserProduct.query.filter_by(product_id=product_id).all()
        user_prod_ids = [i.user_prod_id for i in user_prods]
        reviews = Review.query.filter(Review.user_prod_id.in_(user_prod_ids)).all()
        product["reviews"] = [i.review_to_dict() for i in reviews]

        prod_images = ProductImage.query.filter_by(product_id=product_id).all()
        prod_images_dict = [img.image_path() for img in prod_images]

        product["images"] = prod_images_dict
    return jsonify({'products': products_list}), 200


@app.route('/product/<int:product_id>', methods=['GET', 'POST'])
@jwt_required()
def get_product_by_id(product_id):
    prod = Product.query.filter_by(product_id=product_id).first()
    if not prod:
        return jsonify(message="Product Does Not Exist"), 404
    if request.method == 'GET':
        prod_images = ProductImage.query.filter_by(product_id=product_id).all()
        products_info = prod.product_to_dict()

        user_prods = UserProduct.query.filter_by(product_id=product_id).all()
        user_prod_ids = [i.user_prod_id for i in user_prods]
        reviews = Review.query.filter(Review.user_prod_id.in_(user_prod_ids)).all()
        products_info["reviews"] = [i.review_to_dict() for i in reviews]

        prod_images_dict = [img.image_path() for img in prod_images]
        products_info["images"] = prod_images_dict

        owner = User.query.filter_by(id=prod.owner_id).first()
        owner_info = owner.view_user_to_dict()

        profile_image_obj = ProfileImages.query.filter_by(user_id=owner.id).first()
        if profile_image_obj:
            profile_image = profile_image_obj.get_image_path()
            owner_info.update(profile_image)

        # return jsonify(
        #     {'user_info': user_info, 'products_info': products_info, "cart_products_info": cart_products_info}), 200

        return jsonify(products_info=products_info, owner_info=owner_info), 200
    elif request.method == 'POST':
        data = request.json
        rating = data.get("rating")
        user = get_user()
        status_code = 200
        if user.id == prod.owner_id:
            return jsonify(message="You Can Not Rate Your Product"), 404

        if not 1 <= rating <= 5:
            return jsonify(message="Rating is So High or Low"), 404

        user_rate = UserRates.query.filter_by(user_id=user.id, product_id=product_id).first()
        if not user_rate:
            user_rate = UserRates(user_id=user.id, product_id=product_id)
            status_code = 205
        else:
            prod.rating -= user_rate.rating
            prod.rating_count -= 1
        user_rate.rating = rating
        db.session.add(user_rate)
        db.session.commit()

        prod.rating = (prod.rating + rating)
        prod.rating_count += 1
        prod.final_rating = round(prod.rating / prod.rating_count, 1)
        db.session.commit()
        return jsonify(message="Rating is Updated"), status_code


@app.route('/add_review/<int:product_id>', methods=['POST'])
@jwt_required()
def add_review(product_id):
    data = request.json
    text = data.get("reviews")

    user = get_user()
    user_id = user.id
    if not user:
        return jsonify(message="User Not Found"), 404
    if not product_id:
        return jsonify(message="Product ID is Required"), 400

    prod = Product.query.get(product_id)
    if not prod:
        return jsonify(message="Product Does Not Exist"), 404

    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify(message="User Not Found"), 404

    if prod.owner_id == user.id:
        return jsonify(message="You Can Not Review Your Own Product"), 404

    user_prod = UserProduct.query.filter_by(user_id=user_id, product_id=product_id).first()
    if not user_prod:
        user_prod = UserProduct(user_id=user_id, product_id=product_id)
        db.session.add(user_prod)
        db.session.commit()

    review_item = Review(user_prod_id=user_prod.user_prod_id, comment=text, posted_at=datetime.utcnow())
    db.session.add(review_item)
    db.session.commit()

    return jsonify(message="Review Added Successfully"), 200


@app.route('/report', methods=['POST'])
@jwt_required()
def send_report():
    user = get_user()
    data = request.json
    report_text = data.get("report")
    subject = data.get("subject")
    if not report_text:
        return jsonify(message="Add Your Report Message For This Product"), 200
    helpers.report_email(user.first_name, user.last_name, report_text, subject, user.email)

    return jsonify(message="Report Sent Successfully"), 200
