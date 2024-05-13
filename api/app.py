from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_login import LoginManager

from config import DevEnvConfig

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config.from_object(DevEnvConfig)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 1800
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 604800

cors = CORS(support_credentials=True)
cors.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)

jwt = JWTManager()
jwt.init_app(app)

cors = CORS(app, resources={r"/*": {"origins": "*"}}, expose_headers=["content-range", "Access-Control-Allow-Origin"])

# csrf = CSRFProtect(app)
from views.auth import *
from views.application import *
from views.saves import *
from views.product import *
from views.user import *

from models import *

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000)
