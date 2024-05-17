db_name = "market"
import os

username = os.getenv('username')
password = os.getenv('password')
hostname = os.getenv('hostname')
port = os.getenv('port', '5432')
db_name = os.getenv('db_name')

# username = "postgres"
# password = "<EUfZbv!c2%L2}*nJ5S:wZqEsbf_"
# hostname = "postgres-database.cna0qw26ks1k.eu-north-1.rds.amazonaws.com"
# port = '5432'
# db_name = "market"


class Config:
    # SQLALCHEMY_DATABASE_URI = f'postgresql://postgres:Samvel357552@localhost:5432/{db_name}'
    SQLALCHEMY_DATABASE_URI = f'postgresql://{username}:{password}@{hostname}:{port}/{db_name}'
    SECRET_KEY = 'secret-key'
    SECURITY_FRESHNESS_GRACE_PERIOD = 3600
    SECURITY_DEFAULT_REMEMBER_ME = True
    SECURITY_REGISTERABLE = True
    JWT_SECRET_KEY = 'secret_very_secret'


class DevEnvConfig(Config):
    HOST = '0.0.0.0'
    PORT = 5000
    DEBUG = True
    # SQLALCHEMY_DATABASE_URI = f'postgresql://postgres:Samvel357552@localhost:5432/{db_name}'
    SQLALCHEMY_DATABASE_URI = f'postgresql://{username}:{password}@{hostname}:{port}/{db_name}'
    # UPLOAD_FOLDER = os.path.join(current_path, 'videos')