db_name = "test1"

class Config:
    SQLALCHEMY_DATABASE_URI = f'postgresql://postgres:Samvel357552@localhost:5432/{db_name}'
    SECRET_KEY = 'secret-key'
    SECURITY_FRESHNESS_GRACE_PERIOD = 3600
    SECURITY_DEFAULT_REMEMBER_ME = True
    SECURITY_REGISTERABLE = True
    JWT_SECRET_KEY = 'secret_very_secret'


class DevEnvConfig(Config):
    HOST = '0.0.0.0'
    PORT = 5000
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = f'postgresql://postgres:Samvel357552@localhost:5432/{db_name}'
    # UPLOAD_FOLDER = os.path.join(current_path, 'videos')
