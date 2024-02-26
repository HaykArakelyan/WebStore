# Webstore

Welcome to Webstore! This project combines the power of **React.js** for the frontend and **Flask** with **PostgreSQL** for the backend.

## Frontend Installation

1. Install dependencies: `npm i`
2. Start the Dev Server: `npm start`

## Backend Installation

1. Install the Virtual Environment Package: `pip install virtualenv`
2. Create a Virtual Environment: `virtualenv myenv`
3. Activate the Virtual Environment:
    - Windows: `myenv\\Scripts\\activate`
    - Linux: `source myenv/bin/activate`
4. Install required packages: `pip install -r requirements.txt`
5. Run the backend: `python api/app.py`

## Configuration of PgAdmin

1. During the installation of PgAdmin, you will be asked to create a password for the default user "postgresql."
2. Register a Server called "autoserver."
3. In `api/config.py`, update the following line:

    ```python
    class Config:
        SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:<YOUR PASSWORD HERE>@localhost:5432/market'
        ...

    class DevEnvConfig(Config):
        ...
        SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:root@localhost:5432/market'
    ```

Feel free to adapt this `README.md` to provide more context or additional details about your project. Happy coding! 🚀
