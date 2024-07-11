"""
Helper functions for authentication and authorization.
"""

import asyncio
import re
from werkzeug.exceptions import UnprocessableEntity
from backend.database.database import MongoDBAccess

# Check for valid first name
def check_first_name(first_name):
    # first name should be at least 1 character and at most 50 characters long
    if len(first_name.strip()) < 1 or len(first_name.strip()) > 50:
        raise UnprocessableEntity('First name must be between 1 and 50 characters!')
    # first name has valid characters
    if bool(re.match('^[a-zA-Z0-9.-]*$', first_name)) == False:
        raise UnprocessableEntity('First name cannot contain special characters!')
    return

# Check for valid last name
def check_last_name(last_name):
    # last name should be at least 1 character and at most 50 characters long
    if len(last_name.strip()) < 1 or len(last_name.strip()) > 50:
        raise UnprocessableEntity('Last name must be between 1 and 50 characters!')
    # last name has valid characters
    if bool(re.match('^[a-zA-Z0-9.-]*$', last_name)) == False:
        raise UnprocessableEntity('Last name cannot contain special characters!')
    return

# Check for valid maximum weekly working hours
def check_weekly_work_hours(weekly_work_hours):
    # maximum weekly working hours should be at least 1 hour and at most 168 hours
    if weekly_work_hours < 1:
        raise UnprocessableEntity('Maximum weekly working hours should be at least one hour!')
    if weekly_work_hours > 168:
        raise UnprocessableEntity('Maximum weekly working hours should be at most 168 hours!')
    return

# Checks for valid email structure using regex
def check_email_structure(email):
    email_match = r'^\w+([\.-]?\w+)*@\w([\.-]?\w+)*(\.\w{2,3})+$'
    return bool(re.search(email_match, email))

# Checks if email is already registered
def check_existing_email(email):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    user = loop.run_until_complete(db.get_user_from_email(email))
    loop.close()

    if user is not None:
        return True
    return False

# Check for valid email
def check_email(email):
    # check for valid email structure
    if not check_email_structure(email):
        raise UnprocessableEntity('Entered email is not valid!')
    # check if email is already registered
    if check_existing_email(email):
        raise UnprocessableEntity('Email already taken by another registered user!')
    return

# Check for valid password
def check_password(password):
    # password should be at least 6 characters long
    if len(password) < 6:
        raise UnprocessableEntity('Password entered is less than 6 characters long!')
    return
