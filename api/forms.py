from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators, EmailField, IntegerField

from constants import ErrorMessages as em, any_of_in_password
from flask_wtf import FlaskForm
from wtforms import PasswordField, SubmitField
from wtforms.validators import DataRequired, EqualTo, Length


class EmailFieldWithAt(StringField):
    def __init__(self, label=None, validators=None, **kwargs):
        if validators is None:
            validators = []
        validators.append(validators.Regexp('.*@.*', message='Invalid email format'))
        super().__init__(label, validators, **kwargs)

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[validators.DataRequired(message=em.username_required)])
    password = PasswordField('Password', validators=[validators.DataRequired(message=em.password_required)])


class RegisterForm(FlaskForm):
    firstname = StringField('First Name', [validators.DataRequired(message=em.firstname_required)])
    lastname = StringField('Last Name', [validators.DataRequired(message=em.lastname_required)])
    age = IntegerField('Age', [validators.DataRequired(message=em.age_required),
                               validators.NumberRange(min=18, max=100, message=em.age_invalid)])
    email = EmailFieldWithAt('Email', [validators.DataRequired(message=em.email_required), validators.Length(min=4, max=100)])
    phone = StringField('Phone Number', [validators.DataRequired(message=em.phone_required)])
    password = PasswordField('Enter Password', [validators.DataRequired(message=em.password_required),
                                                validators.Length(min=6, max=20),
                                                validators.AnyOf(values=any_of_in_password,
                                                                 message="The password must have at least one character '!', '@', '#', '$', '%', '&', '*', '.'"),
                                                validators.EqualTo('password_confirm', message=em.password_match)])
    password_confirm = PasswordField('Confirm Password')


class PasswordResetForm(FlaskForm):
    password = PasswordField('New Password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm New Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Reset Password')
