from flask import request, jsonify
from flask_jwt_extended import jwt_required
from flask_login import current_user
from sqlalchemy.orm.strategy_options import joinedload

from helpers import jwt_decoder
from flask_jwt_extended import  jwt_required, get_jwt, get_jwt_identity

from app import app
from models import User, db, Product, UserProduct


@app.route('/user_profile/<user_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def get_course_by_id(user_id):
    if request.method == 'GET':
        user = User.query.get(user_id)
        if user:
            # Fetch the user's products IDs from the UserProduct table
            user_product_ids = UserProduct.query.filter_by(user_id=user_id).all()
            # Fetch the products using the IDs
            products_info = [Product.query.get(user_product.product_id).product_to_dict() for user_product in
                             user_product_ids]
            # Convert user information to dictionary format
            user_info = user.user_to_dict()

            return jsonify({'user_info': user_info, 'products_info': products_info}), 200
        else:
            return jsonify(message="User not found"), 404
    elif request.method == 'PUT':
        data = request.json
        new_first_name = data.get('first_name')
        new_last_name = data.get('last_name')
        new_email = data.get('email')
        new_phone = data.get('phone')
        new_gender = data.get('gender')
        if data:
            user = User.query.filter_by(id=user_id).first()
            if user:
                user.first_name = new_first_name
                user.last_name = new_last_name
                user.email = new_email
                user.phone = new_phone
                user.gender = new_gender
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


#TODO user profile by jwt data
    # @app.route('/user_profile', methods=['GET', 'PUT', 'DELETE'])
    # @jwt_required()
    # def get_course_by_id():
    #     if request.method == 'GET':
    #         data = request.json
    #         jwt_token = data.get('access_token')
    #         jwt_data = jwt_decoder(jwt_token)
    #         user_info = jwt_data['sub'][0]
    #         # print(*jwt_data['sub'])
    #         # print(type(*jwt_data['sub']))
    #         # return jsonify(jwt_data), 200


@app.route('/add_product', methods=['POST'])
@jwt_required()
def add_product():
    if request.method == "POST":
        user_email = get_jwt_identity()[0]
        data = request.json

        if data:
            title = data.get("title")
            discountPercentage = data.get("discountPercentage")
            stock = data.get("stock")
            brand = data.get("brand")
            category = data.get("category")
            description = data.get("description")
            price = data.get("price")
            rating = data.get("rating")
            rating_count = data.get("rating_count")
            final_rating = data.get("final_rating")

            product = Product(
                title=title,
                discountPercentage=discountPercentage,
                stock=stock,
                brand=brand,
                category=category,
                description=description,
                price=price,
                rating=rating,
                rating_count=rating_count,
                final_rating=final_rating,
            )
            db.session.add(product)
            db.session.commit()

            user = User.query.filter_by(email=user_email).first()

            if user:
                user_id = user.id
                print(user_id)
                user_product = UserProduct(product_id=product.product_id, user_id=user_id)
                db.session.add(user_product)
                db.session.commit()

                return jsonify(message="Product added successfully"), 200
            else:
                return jsonify(message="User not found"), 404
        else:
            return jsonify(message="No data provided"), 400


@app.route('/edit_product/<int:product_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def edit_product(product_id):
    user_email = get_jwt_identity()[0]
    data = request.json

    if request.method == 'PUT':
        if data:
            product = Product.query.get(product_id)
            if product:
                user = User.query.filter_by(email=user_email).first()
                if user:
                    user_id = user.id
                    user_product = UserProduct.query.filter_by(product_id=product_id, user_id=user_id).first()
                    if user_product:
                        product.title = data.get("title", product.title)
                        product.discountPercentage = data.get("discountPercentage", product.discountPercentage)
                        product.stock = data.get("stock", product.stock)
                        product.brand = data.get("brand", product.brand)
                        product.category = data.get("category", product.category)
                        product.description = data.get("description", product.description)
                        product.price = data.get("price", product.price)
                        product.rating = data.get("rating", product.rating)
                        product.rating_count = data.get("rating_count", product.rating_count)
                        product.final_rating = data.get("final_rating", product.final_rating)

                        db.session.commit()
                        return jsonify(message="Product updated successfully"), 200
                    else:
                        return jsonify(message="You are not authorized to edit this product"), 403
                else:
                    return jsonify(message="User not found"), 404
            else:
                return jsonify(message="Product not found"), 404
        else:
            return jsonify(message="No data provided"), 400
    elif request.method == 'DELETE':
        # Fetch the product
        product = Product.query.get(product_id)
        if product:
            # Delete associated entries in the `user_prod` table
            UserProduct.query.filter_by(product_id=product_id).delete()
            db.session.commit()

            # Now delete the product
            db.session.delete(product)
            db.session.commit()
            return jsonify(message="Product deleted successfully"), 200
        else:
            return jsonify(message="Product not found"), 404
    else:
        return jsonify(message="Invalid request method"), 405

@app.route('/dashboard/products', methods=['GET'])
def get_all_products():
    products = Product.query.all()
    products_info = [product.product_to_dict() for product in products]
    return jsonify({'products_info': products_info}), 200













