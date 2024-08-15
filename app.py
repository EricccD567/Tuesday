"""
Modular HTTP Flask server using blueprints.
"""

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

from .routes.auth_routes import auth as auth_bp
app.register_blueprint(auth_bp)

from .routes.task_routes import task as task_bp
app.register_blueprint(task_bp)

from .routes.user_routes import user as user_bp
app.register_blueprint(user_bp)

from .routes.connection_routes import connection as connection_bp
app.register_blueprint(connection_bp)

if __name__ == '__main__':
    app.run()
