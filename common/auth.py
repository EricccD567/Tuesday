"""
Authentication and authorization functions to check user registration details, register, login and logout a user.
"""

import asyncio
import hashlib
import jwt
from werkzeug.exceptions import BadRequest, Unauthorized
from database.database import MongoDBAccess
from helpers.auth_helpers import check_first_name, check_last_name, check_weekly_work_hours, check_email, check_password

# Validate new user registration details
def check_registration_details(first_name, last_name, weekly_work_hours, email, password):
    check_first_name(first_name)
    check_last_name(last_name)
    check_weekly_work_hours(weekly_work_hours)
    check_email(email)
    check_password(password)

    return {'is_valid': True}

# Register a new user and add them to the database
def auth_register(first_name, last_name, weekly_work_hours, email, password, avatar):
    check_registration_details(first_name, last_name, weekly_work_hours, email, password)

    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    users = loop.run_until_complete(db.get_all_entries('Users'))
    password = hashlib.sha256(password.encode()).hexdigest()
    u_id = loop.run_until_complete(db.count_collection('Users')) # new user id is assigned to total number of users in the database
    token = jwt.encode({'u_id': u_id}, 'jekfwbdkbwkf', algorithm='HS256')

    new_user_document = {
        '_id': u_id,
        'first_name': first_name,
        'last_name': last_name,
        'weekly_work_hours': weekly_work_hours,
        'email': email,
        'password': password,
        'token': token,
        'connections':[],
        'buffer': 0,
        'avatar': avatar,
    }
    loop.run_until_complete(db.insert_document('Users', new_user_document))
    loop.close()

    return {
        'u_id': u_id,
        'token': token,
    }

# Log in a user
def auth_login(email, password):
    password = hashlib.sha256(password.encode()).hexdigest()

    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    user = loop.run_until_complete(db.get_user_from_email(email))
    if user is None:
        loop.close()
        raise Unauthorized('This email has not been registered previously!')
    if password != user.get('password'):
        loop.close()
        raise Unauthorized('Incorrect password!')
    if user.get('token') != 'False':
        loop.close()
        raise BadRequest('You are already logged in!')

    token = jwt.encode({'u_id': user.get('_id')}, 'jekfwbdkbwkf', algorithm='HS256')
    user['token'] = token
    loop.run_until_complete(db.edit_document('Users', user.get('_id'), user))
    loop.close()

    return {
        'u_id': user.get('_id'),
        'token': token,
    }

# Log out a user
def auth_logout(token):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    user = loop.run_until_complete(db.get_user_from_token(token))
    if user is not None:
        user['token'] = 'False'
        loop.run_until_complete(db.edit_document('Users', user.get('_id'), user))
        loop.close()
        return {'is_success': True}

    loop.close()
    raise BadRequest('Something went wrong, you could not be logged out.')
