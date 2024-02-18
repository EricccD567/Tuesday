"""
Authentication and authorization HTTP Flask server routes.
"""

from flask import Blueprint, request, jsonify
from werkzeug.exceptions import HTTPException
from ..common.auth import check_registration_details, auth_register, auth_login, auth_logout

auth = Blueprint('auth', __name__, url_prefix='/auth/')

'''
Checks if user registration details are valid
Method: POST
Headers: N/A
Data: first_name, last_name, weekly_work_hours, email, password
'''
@auth.route("/register/check", methods=['POST'])
def register_check():
    data = request.get_json()
    first_name = data['first_name']
    last_name = data['last_name']
    weekly_work_hours = data['weekly_work_hours']
    email = data['email']
    password = data['password']

    try:
        check_registration_details(first_name, last_name, weekly_work_hours, email, password)
        return {}
    except HTTPException as e:
        return jsonify(message=e.description, cause=str(e)), e.code

'''
Register a new user
Method: POST
Headers: N/A
Data: first_name, last_name, weekly_work_hours, email, password, avatar
'''
@auth.route("/register", methods=['POST'])
def register():
    data = request.get_json()
    first_name = data['first_name']
    last_name = data['last_name']
    weekly_work_hours = data['weekly_work_hours']
    email = data['email']
    password = data['password']
    avatar = data['avatar']

    try:
        register_return = auth_register(first_name, last_name, weekly_work_hours, email, password, avatar)
        return {
            'token': register_return.get('token'),
            'u_id': register_return.get('u_id'),
        }
    except HTTPException as e:
        return jsonify(message=e.description, cause=str(e)), e.code

'''
Login a user
Method: POST
Headers: N/A
Data: email, password
'''
@auth.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    try:
        login_return = auth_login(email, password)
        return {
            'token': login_return.get('token'),
            'u_id': login_return.get('u_id'),
        }
    except HTTPException as e:
        return jsonify(message=e.description, cause=str(e)), e.code

'''
Logout a user
Method: POST
Headers: Authorization
'''
@auth.route("/logout", methods=['POST'])
def logout():
    token = request.headers.get('Authorization')

    try:
        auth_logout(token)
        return {}
    except HTTPException as e:
        return jsonify(message=e.description, cause=str(e)), e.code
