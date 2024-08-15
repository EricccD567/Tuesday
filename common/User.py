"""
User functions responsible for the user routes.
"""

import asyncio
from flask import jsonify
from werkzeug.exceptions import HTTPException, NotFound
from database.database import MongoDBAccess
from helpers.backend_helpers import _get_connected_tasks
from helpers.auth_helpers import check_weekly_work_hours
from helpers.user_helpers import get_workload

# Returns the details displayed on the requestor's profile
def _get_profile_details(token):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        user = loop.run_until_complete(db.get_user_from_token(token))
        loop.close()
        workload = get_workload(user.get('_id'))
        return {
            'first_name': user.get('first_name'),
            'last_name': user.get('last_name'),
            'email': user.get('email'),
            'weekly_work_hours': user.get('weekly_work_hours'),
            'workload_status': workload,
            'avatar': user.get('avatar'),
        }
    except HTTPException as e:
        loop.close()
        return jsonify(message=e.description, cause=str(e)), e.code

# Get the avatar of the requestor
def _get_profile_avatar(token):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        user = loop.run_until_complete(db.get_user_from_token(token))
        loop.close()
        return {
            'avatar': user.get('avatar'),
        }
    except HTTPException as e:
        loop.close()
        return jsonify(message=e.description, cause=str(e)), e.code

# Edit the values of the requestors profile
def _edit_profile(token, weekly_work_hours, avatar):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        user = loop.run_until_complete(db.get_user_from_token(token))
        check_weekly_work_hours(weekly_work_hours)

        editted_user = {
            '_id': user.get('_id'),
            'first_name': user.get('first_name'),
            'last_name': user.get('last_name'),
            'weekly_work_hours': weekly_work_hours,
            'email': user.get('email'),
            'password': user.get('password'),
            'token': token,
            'connections': user.get('connections'),
            'buffer': user.get('buffer'),
            'avatar': avatar,
        }
        loop.run_until_complete(db.edit_document('Users', user.get('_id'), editted_user))
        loop.close()
        return {}
    except HTTPException as e:
        loop.close()
        return jsonify(message=e.description, cause=str(e)), e.code

# Get the details of all users in the database
def _get_all_user_details():
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        users = loop.run_until_complete(db.get_all_entries('Users'))
        all_users_details = []
        for user in users:
            all_users_details.append({
                'user_id': user.get('_id'),
                'first_name': user.get('first_name'),
                'last_name': user.get('last_name'),
            })
        loop.close()
        return all_users_details
    except HTTPException as e:
        loop.close()
        return jsonify(message=e.description, cause=str(e)), e.code

# Get the details of all users connected to the requestor
def _get_connected_user_details(token):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        requestor = loop.run_until_complete(db.get_user_from_token(token))
        requestor_connections = requestor.get('connections')
        connected_user_details = []
        connected_user_details.append({
            'user_id': requestor.get('_id'),
            'first_name': requestor.get('first_name'),
            'last_name': requestor.get('last_name'),
        })

        for connection in requestor_connections:
            user = loop.run_until_complete(db.get_user_from_uid(connection))
            connected_user_details.append({
                'user_id': user.get('_id'),
                'first_name': user.get('first_name'),
                'last_name': user.get('last_name'),
            })
        loop.close()
        return connected_user_details
    except HTTPException as e:
        loop.close()
        return jsonify(message=e.description, cause=str(e)), e.code

# Get the profile details on a user the requestor is connected to
def _get_any_profile_details(u_id, token):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        requestor = loop.run_until_complete(db.get_user_from_token(token))
        target = loop.run_until_complete(db.get_user_from_uid(u_id))

        if target is None:
            raise NotFound('Cannot find this user!')
        if target.get('_id') not in requestor.get('connections'):
            raise NotFound('Cannot find this user!')

        loop.close()
        workload = get_workload(target.get('_id'))
        return {
            'first_name': target.get('first_name'),
            'last_name': target.get('last_name'),
            'email': target.get('email'),
            'weekly_work_hours': target.get('weekly_work_hours'),
            'workload_status': workload,
            'avatar': target.get('avatar'),
        }
    except HTTPException as e:
        loop.close()
        return jsonify(message=e.description, cause=str(e)), e.code

# Gets the tasks assigned to a user that the requestor is connected to
def _get_user_tasks(token, u_id):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        requestor = loop.run_until_complete(db.get_user_from_token(token))
        target = loop.run_until_complete(db.get_user_from_uid(u_id))

        if target is None:
            raise NotFound('Cannot find this taskboard!')
        if target.get('_id') not in requestor.get('connections'):
            raise NotFound('Cannot find this taskboard!')

        target_id = target.get('_id')
        loop.close()
        return _get_connected_tasks(target_id)
    except HTTPException as e:
        loop.close()
        return jsonify(message=e.description, cause=str(e)), e.code
