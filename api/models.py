from datetime import datetime
from hashlib import sha256

from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# from app import db
from app import app

db = SQLAlchemy(app)


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    balance = db.Column(db.Integer, nullable=False)
    img = db.Column(db.String(255), nullable=True)
    registered_at = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    #TODO Get img for every user
    #TODO do email validations, unique

    def user_to_dict(self):
        user_dict = {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'gender': self.gender,
            'age': self.age,
            'balance': self.balance,
            'img': self.img,
            'registered_at': self.registered_at
        }
        return user_dict

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_hash(st):
        return sha256(st.encode('utf-8')).hexdigest()


#
class Product(db.Model):
    __tablename__ = 'products'
    product_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False, unique=True)  # Add nullable and unique constraints
    discountPercentage = db.Column(db.Float)
    stock = db.Column(db.Integer)
    brand = db.Column(db.String(50))
    category = db.Column(db.String(50))
    description = db.Column(db.Text)
    price = db.Column(db.Float)
    rating = db.Column(db.Integer)
    rating_count = db.Column(db.Integer)
    final_rating = db.Column(db.Float)
    created_at = db.Column(db.TIMESTAMP,  default=datetime.utcnow)

    def product_to_dict(self):
        return {
            'product_id': self.product_id,
            'title': self.title,
            'discountPercentage': self.discountPercentage,
            'stock': self.stock,
            'brand': self.brand,
            'category': self.category,
            'description': self.description,
            'price': self.price,
            'rating': self.rating,
            'rating_count': self.rating_count,
            'final_rating': self.final_rating,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Review(db.Model):
    __tablename__ = 'reviews'
    reviews_id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.Text, nullable=False)  # Add nullable constraint
    user_prod_id = db.Column(db.Integer, db.ForeignKey('user_prod.user_prod_id'))
    posted_at = db.Column(db.TIMESTAMP)


class UserProduct(db.Model):
    __tablename__ = 'user_prod'
    user_prod_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'))


class Report(db.Model):
    __tablename__ = 'reports'
    report_id = db.Column(db.Integer, primary_key=True)
    report_text = db.Column(db.Text, nullable=False)
    user_prod_id = db.Column(db.Integer, db.ForeignKey('user_prod.user_prod_id'))


class Image(db.Model):
    __tablename__ = 'img'
    img_id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'))
    img_path = db.Column(db.String(50), nullable=False, unique=True)  # Add nullable and unique constraints
