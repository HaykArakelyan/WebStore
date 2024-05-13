from flask import request, jsonify
from flask_jwt_extended import jwt_required

from app import app
from helpers import get_user
from models import db, Product, UserProduct, Cart, ProductImage, Review


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

