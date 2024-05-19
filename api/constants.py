# constants.py

class ErrorMessages:
    age_required = 'Age is Required'
    firstname_required = 'First Name is Required'
    lastname_required = 'Last Name is Required'
    username_required = 'Username is Required'
    email_required = 'Email is Required'
    phone_required = 'Phone is Required'
    password_length = 'Password Should be At Least 8 Characters Long'
    password_match = 'Passwords Must Match'
    age_invalid = 'Age Must be Between 18 and 100'
    email_invalid = 'Invalid Email Format'
    gender_required = 'Gender is Required'
    email_exist = "Email Already Exists"
    missing_required_fields = "Missing Required Field: {}"
    password_chars = 'Password Must Contain at Least One of the Following Characters: !, @, #, $, %, &, *, .'
    missing_credentials = 'Email and Password are Required'
    invalid_credentials = 'Invalid Email or Password'
    unverified_email = 'Please Verify Your Email Before Logging In'
class successMessages:
    success_register = 'User Registered And Verification Email Sent'
    login_successful = 'Login Successful'
# Regular expression for email validation
EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

# List of allowed characters in passwords
ALLOWED_CHARACTERS_IN_PASSWORD = ['!', '@', '#', '$', '%', '&', '*', '.']
