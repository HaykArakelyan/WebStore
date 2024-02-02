from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators, EmailField, BooleanField
from constants import ErrorMessages as em, any_of_in_password


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[validators.DataRequired(message=em.username_required)])
    password = PasswordField('Password', validators=[validators.DataRequired(message=em.password_required)])


class RegisterForm(FlaskForm):
    firstname = StringField('First Name', [validators.DataRequired(message=em.firstname_required)])
    lastname = StringField('Last Name', [validators.DataRequired(message=em.lastname_required)])
    username = StringField('Username',
                           [validators.DataRequired(message=em.username_required), validators.Length(min=4, max=100)])
    email = EmailField('Email',
                       [validators.DataRequired(message=em.email_required), validators.Length(min=4, max=100)])
    phone = StringField('Phone Number', [validators.DataRequired(message=em.phone_required)])
    password = PasswordField('Enter Password', [validators.DataRequired(message=em.password_required),
                                                validators.Length(min=6, max=20),
                                                validators.AnyOf(values=any_of_in_password,
                                                                 message="The password must have at least one character '!', '@', '#', '$', '%', '&', '*', '.'"),
                                                validators.EqualTo('password_confirm', message=em.password_match)])
    password_confirm = PasswordField('Confirm Password')