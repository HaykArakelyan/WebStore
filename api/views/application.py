from datetime import datetime

from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import app
from helpers import get_user
from models import User, db, Product, UserProduct, ProfileImages, Cart, ProductImage, Review, Report, UserRates
from hashlib import sha256

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

                cart_products_info.append(cart_product_info)

            for product_info in products_info:
                product_id = product_info["product_id"]
                user_prods = UserProduct.query.filter_by(product_id=product_id).all()
                user_prod_ids = [user_prod.user_prod_id for user_prod in user_prods]
                reviews = Review.query.filter(Review.user_prod_id.in_(user_prod_ids)).all()
                product_info["reviews"] = [review.review_to_dict() for review in reviews]

            user_info = user.user_to_dict()
            profile_image_obj = ProfileImages.query.filter_by(user_id=user.id).first()
            if profile_image_obj:
                profile_image = profile_image_obj.get_image_path()
                user_info = {**user_info, **profile_image, "user_id": sha256(str(user.id).encode('utf-8')).hexdigest()}

            return jsonify(
                {'user_info': user_info, 'products_info': products_info, "cart_products_info": cart_products_info}), 200
        else:
            return jsonify(message="User not found"), 404
    elif request.method == 'PUT':
        data = request.json
        new_first_name = data.get('first_name')
        new_last_name = data.get('last_name')
        new_email = data.get('email')
        new_phone = data.get('phone')
        new_gender = data.get('gender')
        if not data:
            return jsonify(message='Bad request'), 400

        if not user:
            return jsonify(message='User not found'), 404

        user.first_name = new_first_name
        user.last_name = new_last_name
        user.email = new_email
        user.phone = new_phone
        user.gender = new_gender

        profile_image_url = data.get("profile_image")
        if profile_image_url:
            profile_image = ProfileImages.query.filter_by(user_id=user.id).first()
            if profile_image:
                profile_image.image_path = profile_image_url
            else:
                new_profile_image = ProfileImages(user_id=user.id, image_path=profile_image_url)
                db.session.add(new_profile_image)
        db.session.commit()
        return jsonify({'message': 'User info updated successfully'}), 200

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
            return jsonify({'message': 'User and associated data deleted successfully'}), 200
        else:
            return jsonify({'message': 'User not found'}), 404

    return jsonify(message='Bad request'), 400


@app.route('/add_product', methods=['POST'])
@jwt_required()
def add_product():
    if request.method == "POST":

        data = request.json
        user = get_user()

        if not user:
            return jsonify(message="User not found"), 404

        if not data:
            return jsonify(message="No data provided"), 400

        title = data.get("title")
        discount_percentage = data.get("discountPercentage")
        stock = data.get("stock")
        brand = data.get("brand")
        category = data.get("category")
        description = data.get("description")
        price = data.get("price")

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
        return jsonify(message="Product added successfully"), 200


@app.route('/edit_product/<int:product_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def edit_product(product_id):
    user = get_user()
    if not user:
        return jsonify(message="You are not authorized to edit this product"), 403

    if request.method == 'PUT':

        data = request.json
        if not data:
            return jsonify(message="No data provided"), 400

        product = Product.query.get(product_id)
        if not product:
            return jsonify(message="Product not found"), 404

        user_product = Product.query.filter_by(product_id=product_id, owner_id=user.id).first()
        if not user_product:
            return jsonify(message="User not found"), 404

        product.title = data.get("title", product.title)
        product.discountPercentage = data.get("discountPercentage", product.discountPercentage)
        product.stock = data.get("stock", product.stock)
        product.brand = data.get("brand", product.brand)
        product.category = data.get("category", product.category)
        product.description = data.get("description", product.description)
        product.price = data.get("price", product.price)
        db.session.commit()
        return jsonify(message="Product updated successfully"), 200

    elif request.method == 'DELETE':
        product = Product.query.get(product_id)
        if not product:
            return jsonify(message="Product not found"), 404
        UserProduct.query.filter_by(product_id=product_id).delete()
        db.session.commit()

        db.session.delete(product)
        db.session.commit()
        return jsonify(message="Product deleted successfully"), 200
    else:
        return jsonify(message="Invalid request method"), 405


@app.route('/products', methods=['GET'])
def get_all_products():
    products_list = []

    products = Product.query.all()

    if not products:
        return jsonify(message="Products not found"), 404

    for product in products:
        product_info = product.product_to_dict()

        prod_images = ProductImage.query.filter_by(product_id=product.product_id).all()

        user_prods = UserProduct.query.filter_by(product_id=product.product_id).all()
        user_prod_ids = [user_prod.user_prod_id for user_prod in user_prods]

        reviews = Review.query.filter(Review.user_prod_id.in_(user_prod_ids)).all()

        product_info["reviews"] = [review.review_to_dict() for review in reviews]
        product_info["images"] = prod_images

        products_list.append(product_info)

    return jsonify({'products': products_list}), 200



@app.route('/get_products')
@jwt_required()
def get_products():
    user = get_user()
    if not user:
        return jsonify(message="User not found"), 404
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
        return jsonify(message="Product does not exist"), 404

    user = get_user()
    if not user:
        return jsonify(message="User not found"), 404

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

    return jsonify(message="Item added to cart successfully"), 200

@app.route('/get_from_cart', methods=['GET'])
@jwt_required()
def get_from_cart():
    user = get_user()
    if not user:
        return jsonify(message="User not found"), 404

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

        cart_products_info.append(product_info)

    return jsonify({'products': cart_products_info}), 200


@app.route('/add_review/<int:product_id>', methods=['POST'])
@jwt_required()
def add_review(product_id):
    data = request.json
    user_id = data.get("user_id")
    text = data.get("text")

    if not product_id:
        return jsonify(message="Product ID is required"), 400

    prod = Product.query.get(product_id)
    if not prod:
        return jsonify(message="Product does not exist"), 404

    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify(message="User not found"), 404

    if user.id == prod.owner_id:
        return jsonify(message="You can't add a review to your own product"), 400

    user_prod = UserProduct.query.filter_by(user_id=user_id, product_id=product_id).first()
    if not user_prod:
        user_prod = UserProduct(user_id=user_id, product_id=product_id)
        db.session.add(user_prod)
        db.session.commit()

    review_item = Review(user_prod_id=user_prod.user_prod_id, comment=text, posted_at=datetime.utcnow())
    db.session.add(review_item)
    db.session.commit()

    return jsonify(message="Review added successfully"), 200


@app.route('/add_report/<int:product_id>', methods=['POST'])
@jwt_required()
def add_report(product_id):
    data = request.json
    user_id = data.get("user_id")
    report_text = data.get("report_text")
    if not product_id:
        return jsonify(message="invalid json"), 404
    prod = Product.query.get(product_id)
    if not prod:
        return jsonify(message="product does not exist"), 404
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify(message="User not found"), 404
    if user.id == prod.owner_id:
        return jsonify(message="You can't report to your product"), 404
    user_prod = UserProduct.query.filter_by(user_id=user_id, product_id=product_id).first()
    if not user_prod:
        user_prod = UserProduct(user_id=user_id, product_id=product_id)
        db.session.add(user_prod)
        db.session.commit()
    report_item = Report(user_prod_id=user_prod.user_prod_id, report_text=report_text)
    db.session.add(report_item)
    db.session.commit()
    return jsonify(message="Item added to cart successfully"), 200


# TODO: Get Reports ????


@app.route('/product/<int:product_id>', methods=['GET', 'POST'])
@jwt_required()
def get_product_by_id(product_id):
    prod = Product.query.filter_by(product_id=product_id).first()
    if not prod:
        return jsonify(message="product does not exist"), 404
    if request.method == 'GET':
        prod_image = ProductImage.query.filter_by(product_id=product_id).all()
        products_info = prod.product_to_dict()

        user_prods = UserProduct.query.filter_by(product_id=product_id).all()
        user_prod_ids = [i.user_prod_id for i in user_prods]
        reviews = Review.query.filter(Review.user_prod_id.in_(user_prod_ids)).all()
        products_info["reviews"] = [i.review_to_dict() for i in reviews]
        return jsonify({'products_info': products_info, 'product_image': prod_image}), 200
    elif request.method == 'POST':
        data = request.json
        rating = data.get("rating")
        user = get_user()
        if user.id == prod.owner_id:
            return jsonify(message="You can not rate your product"), 404

        if not 1 <= rating <= 5:
            return jsonify(message="Rating is so high or low"), 404

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
        return jsonify(message="Rating is updated"), 200
