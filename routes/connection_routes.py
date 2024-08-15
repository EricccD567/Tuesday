"""
Connection HTTP Flask server routes.
"""

from flask import Blueprint, request
from common.connections import _accept_connection_request, _get_connected_users, _get_connection_requests, _send_connection_request, _unconnect

connection = Blueprint('connection', __name__, url_prefix='/connection/')

'''
Get connected users
Method: GET
Headers: Authorization
Data: N/A
'''
@connection.route("/connected", methods=['GET'])
def get_connected_users():
    token = request.headers.get('Authorization')
    return _get_connected_users(token)

'''
Unconnect a connection
Method: POST
Headers: Authorization
Data: other_uid
'''
@connection.route("/unconnect", methods=['POST'])
def unconnect():
    data = request.get_json()
    other_uid = data['other_user_id']
    token = request.headers.get('Authorization')
    return _unconnect(other_uid, token)

'''
Get connection requests
Method: GET
Headers: Authorization
Data: N/A
'''
@connection.route("/requests", methods=['GET'])
def get_connection_requests():
    token = request.headers.get('Authorization')
    return _get_connection_requests(token)

'''
Send a connection request
Method: POST
Headers: Authorization
Data: email
'''
@connection.route("/requests/send", methods=['POST'])
def send_connection_request():
    data = request.get_json()
    email = data['connection_email']
    token = request.headers.get('Authorization')
    return _send_connection_request(email, token)

'''
Accept a connection request
Method: POST
Headers: Authorization
Data: requestor_uid
'''
@connection.route("/requests/accept", methods=['POST'])
def accept_connection_request():
    data = request.get_json()
    requestor_uid = data['accept_user_id']
    token = request.headers.get('Authorization')
    return _accept_connection_request(requestor_uid, token)
