import base64
import hashlib
import os
from datetime import datetime
from hashlib import sha256

import resend
from flask import request, jsonify
from flask_jwt_extended import jwt_required

import helpers
from app import app
from helpers import get_user
from models import User, db, Product, UserProduct, ProfileImages, Cart, ProductImage, Review, UserRates


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
        if list_data:
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


@app.route('/add_to_cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    data = request.json
    product_id = data.get("product_id")
    if not product_id:
        return jsonify(message="Invalid JSON"), 400

    prod = Product.query.get(product_id)
    if not prod:
        return jsonify(message="Product Does Not Exist"), 404

    user = get_user()
    if not user:
        return jsonify(message="User Not Found"), 404

    if prod.owner_id == user.id:
        return jsonify(message="You Can Not Add Own Product Into Your Saves"), 404

    user_prod = UserProduct.query.filter_by(user_id=user.id, product_id=product_id).first()
    if not user_prod:
        user_prod = UserProduct(user_id=user.id, product_id=product_id)
        db.session.add(user_prod)
        db.session.commit()

    cart_item = Cart.query.filter_by(user_prod_id=user_prod.user_prod_id).first()
    if not cart_item:
        cart_item = Cart(user_prod_id=user_prod.user_prod_id)
        db.session.add(cart_item)
        db.session.commit()

        return jsonify(message="Item Added to Saves Successfully"), 200
    return jsonify(message="Product is Already in Saves"), 400


@app.route('/get_from_cart', methods=['GET'])
@jwt_required()
def get_from_cart():
    user = get_user()
    if not user:
        return jsonify(message="User Not Found"), 404
    if request.method == 'GET':
        user_prods = {user_prod.user_prod_id: user_prod.product_id for user_prod in
                      UserProduct.query.filter_by(user_id=user.id).all()}
        product_ids = [user_prods[cart_item.user_prod_id] for cart_item in
                       Cart.query.filter(Cart.user_prod_id.in_(list(user_prods.keys()))).all()]

        cart_products_info = []
        for user_product in product_ids:
            product = Product.query.get(user_product)
            product_info = product.product_to_dict()

            user_prods = UserProduct.query.filter_by(product_id=product.product_id).all()
            user_prod_ids = [user_prod.user_prod_id for user_prod in user_prods]
            reviews = Review.query.filter(Review.user_prod_id.in_(user_prod_ids)).all()
            product_info["reviews"] = [review.review_to_dict() for review in reviews]

            prod_images = ProductImage.query.filter_by(product_id=product.product_id).all()
            prod_images_dict = [img.image_path() for img in prod_images]
            product_info["images"] = prod_images_dict

            cart_products_info.append(product_info)

        return jsonify({'products': cart_products_info}), 200


@app.route('/delete_from_cart/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_from_cart(product_id):
    user = get_user()
    product_id_to_delete = product_id
    if not product_id_to_delete:
        return jsonify(message="Product ID is Not Provided"), 400

    user_prod_id_to_delete = UserProduct.query.filter_by(user_id=user.id, product_id=product_id_to_delete).first()
    if not user_prod_id_to_delete:
        return jsonify(message="Product Not Found in User's Saves"), 404

    cart_item_to_delete = Cart.query.filter_by(user_prod_id=user_prod_id_to_delete.user_prod_id).first()
    if not cart_item_to_delete:
        return jsonify(message="Product Not Found in Saves"), 404

    db.session.delete(cart_item_to_delete)
    db.session.commit()

    db.session.delete(user_prod_id_to_delete)
    db.session.commit()

    return jsonify(message="Product Removed From Saves Successfully"), 200


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


@app.route('/contact-us', methods=['POST'])
def contact_us():
    data = request.json
    name = data.get("name")
    phone = data.get("phone")
    email = data.get("email")
    message = data.get("message")
    subject = data.get("subject")
    if not name and phone and email and message:
        return jsonify(message="Missing Fields"), 200
    helpers.contactus_email(name, phone, email, message, subject)

    return jsonify(message="Message Sent Successfully"), 200


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
        if user.id == prod.owner_id:
            return jsonify(message="You Can Not Rate Your Product"), 404

        if not 1 <= rating <= 5:
            return jsonify(message="Rating is So High or Low"), 404

        user_rate = UserRates.query.filter_by(user_id=user.id, product_id=product_id).first()
        if not user_rate:
            user_rate = UserRates(user_id=user.id, product_id=product_id)
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
        return jsonify(message="Rating is Updated"), 200


@app.route('/test_email', methods=['POST'])
def send_email():
    resend.api_key = os.getenv("RESEND_API_KEY")
    params = {"from": "contact.us.capstone@spiffyzone.online",
              "to": ["shegiyan.samvel@mail.ru"],
              "subject": "Hello message from Admin mail",
              "html": "<strong>https://www.canva.com/design/DAGB7AvTw-Q/-9vGwf9wbHDR0o5HpgKJwg/edit</strong>",
              }
    r = resend.Emails.send(params)
    return jsonify(r)
