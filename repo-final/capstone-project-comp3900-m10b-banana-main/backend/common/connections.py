"""
Connections functions responsible for the connection routes.
"""

import asyncio
from flask import jsonify
from werkzeug.exceptions import HTTPException, UnprocessableEntity
from backend.helpers.auth_helpers import check_existing_email
from backend.database.database import MongoDBAccess

def _get_connected_users(token):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        requestor = loop.run_until_complete(db.get_user_from_token(token))
        requestor_connections = requestor.get('connections')
        connected_user_details = []
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

def _unconnect(other_uid, token):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        # get users, extract connections list, remove other users id from list, edit entry in the users collection
        other = loop.run_until_complete(db.get_user_from_uid(other_uid))
        requestor = loop.run_until_complete(db.get_user_from_token(token))

        other_connections = other.get('connections')
        requestor_connections = requestor.get('connections')

        other_connections.remove(requestor.get('_id'))
        requestor_connections.remove(other.get('_id'))
        other['connections'] = other_connections
        requestor['connections'] = requestor_connections

        loop.run_until_complete(db.edit_document('Users', other.get('_id'), other))
        loop.run_until_complete(db.edit_document('Users', requestor.get('_id'), requestor))
        loop.close()
        return {}
    except HTTPException as e:
        loop.close()
        return jsonify(message=e.description, cause=str(e)), e.code

def _get_connection_requests(token):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    sender_details = []
    try:
        user_id = loop.run_until_complete(db.get_uid_from_token(token))
        sender_ids = loop.run_until_complete(db.get_connection_requests(user_id))
        for sender_id in sender_ids:
            sender = loop.run_until_complete(db.get_user_from_uid(sender_id))
            sender_details.append({
                'user_id': sender.get('_id'),
                'first_name': sender.get('first_name'),
                'last_name': sender.get('last_name'),
            })
        loop.close()
        return sender_details
    except HTTPException as e:
        loop.close()
        return jsonify(message=e.description, cause=str(e)), e.code
def _send_connection_request(email, token):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        if not check_existing_email(email):
            raise UnprocessableEntity('Email does not belong to a user. Please enter a valid email.')
        sender = loop.run_until_complete(db.get_user_from_token(token))
        receiver = loop.run_until_complete(db.get_user_from_email(email))
        sender_connections = sender.get('connections')
        if receiver.get('_id') in sender_connections:
            raise UnprocessableEntity('You are already connected to this user')
        flag = loop.run_until_complete(db.check_unique_request(sender.get('_id'), receiver.get('_id')))
        if flag == False:
            raise UnprocessableEntity('You have already sent a connection request to this user')
        loop.run_until_complete(db.insert_document('Connection_Requests', {'sender': sender.get('_id'), 'receiver': receiver.get('_id')}))
        loop.close()
        return {}
    except HTTPException as e:
        loop.close()
        return jsonify(message=e.description, cause=str(e)), e.code

def _accept_connection_request(requestor_uid, token):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        # get users, extract connections list, add others uid to list, edit entry in the users collection
        sender = loop.run_until_complete(db.get_user_from_uid(requestor_uid))
        receiver = loop.run_until_complete(db.get_user_from_token(token))

        sender_connections = sender.get('connections')
        receiver_connections = receiver.get('connections')
        if receiver.get('_id') not in sender_connections and sender.get('_id') not in receiver_connections:
            sender_connections.append(receiver.get('_id'))
            receiver_connections.append(sender.get('_id'))
            sender['connections'] = sender_connections
            receiver['connections'] = receiver_connections
            loop.run_until_complete(db.edit_document('Users', sender.get('_id'), sender))
            loop.run_until_complete(db.edit_document('Users', receiver.get('_id'), receiver))
        loop.run_until_complete(db.delete_request(sender.get('_id'), receiver.get('_id')))
        loop.close()
        return {}
    except HTTPException as e:
        loop.close()
        return jsonify(message=e.description, cause=str(e)), e.code
