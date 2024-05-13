# constants.py

class ErrorMessages:
    age_required = 'Age is required'
    firstname_required = 'First name is required'
    lastname_required = 'Last name is required'
    username_required = 'Username is required'
    email_required = 'Email is required'
    phone_required = 'Phone is required'
    password_length = 'Password should be at least 8 characters long'
    password_match = 'Passwords must match'
    age_invalid = 'Age must be between 18 and 100'
    email_invalid = 'Invalid email format'
    gender_required = 'Gender is required'
    email_exist = "Email already exists"
    missing_required_fields = "Missing required field: {}"
    password_chars = 'Password must contain at least one of the following characters: !, @, #, $, %, &, *, .'
    missing_credentials = 'Email and password are required'
    invalid_credentials = 'Invalid email or password'
    unverified_email = 'Please verify your email before logging in'
class successMessages:
    success_register = 'User Registered And Verification Email Sent'
    login_successful = 'Login Successful'
# Regular expression for email validation
EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

# List of allowed characters in passwords
ALLOWED_CHARACTERS_IN_PASSWORD = ['!', '@', '#', '$', '%', '&', '*', '.']
