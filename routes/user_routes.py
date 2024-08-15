"""
User HTTP Flask server routes.
"""

from flask import Blueprint, request, jsonify
from werkzeug.exceptions import HTTPException
from common.User import _edit_profile, _get_all_user_details, _get_any_profile_details, _get_connected_user_details, _get_profile_avatar, _get_profile_details, _get_user_tasks
from common.reports import report_setup

user = Blueprint('user', __name__, url_prefix='/user/')

'''
Get user details for the requestor's profile
Method: GET
Headers: Authorizaton
Data: N/A
'''
@user.route("/profile/details", methods=['GET'])
def get_profile_details():
    token = request.headers.get('Authorization')
    return _get_profile_details(token)

'''
Get user avatar for header
Method: GET
Headers: Authorizaton
Data: N/A
'''
@user.route("/profile/avatar", methods=['GET'])
def get_profile_avatar():
    token = request.headers.get('Authorization')
    return _get_profile_avatar(token)

'''
Edit profile
Method: POST
Headers: Authorizaton
Data: weekly_work_hours, avatar
'''
@user.route("/edit", methods=['POST'])
def edit_profile():
    data = request.get_json()
    token = request.headers.get('Authorization')
    weekly_work_hours = data['weekly_work_hours']
    avatar = data['avatar']
    return _edit_profile(token, weekly_work_hours, avatar)

'''
Get user details for all users in the database
Method: GET
Headers: Authorizaton
Data: N/A
'''
@user.route("/allusers/details", methods=['GET'])
def get_all_user_details():
    _ = request.headers.get('Authorization')
    return _get_all_user_details()

'''
Get user details for connected users (including ourself)
Method: GET
Headers: Authorizaton
Data: N/A
'''
@user.route("/connected/details", methods=['GET'])
def get_connected_user_details():
    token = request.headers.get('Authorization')
    return _get_connected_user_details(token)

'''
Get user details for any user's profile
Method: POST
Headers: Authorizaton
Data: u_id
'''
@user.route("/any/details", methods=['POST'])
def get_any_profile_details():
    data = request.get_json()
    u_id = data['user_id']
    token = request.headers.get('Authorization')
    return _get_any_profile_details(u_id, token)

'''
Get list of assigned tasks
Method: POST
Headers: Authorizaton
Data: u_id
'''
@user.route("/any/tasks", methods=['POST'])
def get_user_tasks():
    data = request.get_json()
    token = request.headers.get('Authorization')
    u_id = data['user_id']
    return _get_user_tasks(token, u_id)

'''
Generate the self-reflection report of the user
Method: Get
Headers: Authorizaton
Data: N/A
'''
@user.route("/report", methods=['GET'])
def get_report():
    token = request.headers.get('Authorization')
    try:
        return report_setup(token)
    except HTTPException as e:
        return jsonify(message=e.description, cause=str(e)), e.code
