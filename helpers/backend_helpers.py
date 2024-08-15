"""
Helper functions for backend.
"""

import asyncio
from werkzeug.exceptions import Unauthorized
from database.database import MongoDBAccess

# Convert a list of assignee ids to a list of assignee user first names
def _assignee_ids_to_first_names(assignee_ids, users):
    assignee_names = []
    for user in users:
        if user.get('_id') in assignee_ids:
            assignee_names.append(user.get('first_name'))
    return assignee_names

# Convert a list of dependency ids to a list of dependency task titles
def _dependency_ids_to_titles(dependency_ids, tasks):
    dependency_titles = []
    for task in tasks:
        if task.get('_id') in dependency_ids:
            dependency_titles.append(task.get('title'))
    return dependency_titles

# Get all the tasks in the database sorted by task_id
def _get_all_database_tasks():
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    # Acquire all tasks and users
    tasks = loop.run_until_complete(db.get_all_entries('Tasks'))
    users = loop.run_until_complete(db.get_all_entries('Users'))
    loop.close()

    # Get all the tasks in the database
    db_tasks = []
    for task in tasks:
        assignee_ids = task.get('assignee_ids')
        assignee_names = _assignee_ids_to_first_names(assignee_ids, users)
        dependency_ids = task.get('dependency_ids')
        dependency_titles = _dependency_ids_to_titles(dependency_ids, tasks)

        db_tasks.append({
            'title': task.get('title'),
            'description': task.get('description'),
            'assignee_ids': task.get('assignee_ids'),
            'assignee_names': assignee_names,
            'creation_date': task.get('creation_date'),
            'deadline': task.get('deadline'),
            'status': task.get('status'),
            'task_id': task.get('_id'),
            'creator_id': task.get('creator_id'),
            'blocking': task.get('blocking'),
            'hours_to_complete': task.get('hours_to_complete'),
            'priority': task.get('priority'),
            'priority_score': task.get('priority_score'),
            'dependency_ids': task.get('dependency_ids'),
            'dependency_titles': dependency_titles,
            'start_time': task.get('start_time'),
            'end_time': task.get('end_time'),
        })

    # Sort by task_id
    db_tasks = sorted(db_tasks, key=lambda t: t['task_id'])

    return db_tasks

# Find the user based on the target_id and get their assigned tasks
# Connection to this user is assumed if this function is called
def _get_connected_tasks(target_id):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    # Acquire all tasks and users
    tasks = loop.run_until_complete(db.get_all_entries('Tasks'))
    users = loop.run_until_complete(db.get_all_entries('Users'))
    loop.close()

    # Find all the tasks that the user is assigned to and return the tasks list
    assigned_tasks = []
    for task in tasks:
        assignee_ids = task.get('assignee_ids')
        if target_id in assignee_ids:
            assignee_names = _assignee_ids_to_first_names(assignee_ids, users)
            dependency_ids = task.get('dependency_ids')
            dependency_titles = _dependency_ids_to_titles(dependency_ids, tasks)

            assigned_tasks.append({
                'title': task.get('title'),
                'description': task.get('description'),
                'assignee_ids': task.get('assignee_ids'),
                'assignee_names': assignee_names,
                'creation_date': task.get('creation_date'),
                'deadline': task.get('deadline'),
                'status': task.get('status'),
                'task_id': task.get('_id'),
                'creator_id': task.get('creator_id'),
                'blocking': task.get('blocking'),
                'hours_to_complete': task.get('hours_to_complete'),
                'priority': task.get('priority'),
                'priority_score': task.get('priority_score'),
                'dependency_ids': task.get('dependency_ids'),
                'dependency_titles': dependency_titles,
                'start_time': task.get('start_time'),
                'end_time': task.get('end_time'),
            })

    return assigned_tasks

# Get all the tasks created by the requestor, assigned to the requestor, created by a connection or assigned to a connection
def _get_all_tasks(token):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    requestor = loop.run_until_complete(db.get_user_from_token(token))
    if requestor is None:
        loop.close()
        raise Unauthorized('You are not logged in!')
    requestor_id = requestor.get('_id')
    requestor_connections = requestor.get('connections')

    # Acquire all tasks and users
    tasks = loop.run_until_complete(db.get_all_entries('Tasks'))
    users = loop.run_until_complete(db.get_all_entries('Users'))
    loop.close()

    # Find all the tasks that match the criteria and return the tasks list
    all_tasks = []
    for task in tasks:
        assignee_ids = task.get('assignee_ids')
        creator_id = task.get('creator_id')
        if (requestor_id == creator_id                                          # creator
                or requestor_id in assignee_ids                                 # assigned too
                or creator_id in requestor_connections                          # creator is a connection
                or any(uid in requestor_connections for uid in assignee_ids)):  # assignee is a connection
            assignee_names = _assignee_ids_to_first_names(assignee_ids, users)
            dependency_ids = task.get('dependency_ids')
            dependency_titles = _dependency_ids_to_titles(dependency_ids, tasks)

            all_tasks.append({
                'title': task.get('title'),
                'description': task.get('description'),
                'assignee_ids': task.get('assignee_ids'),
                'assignee_names': assignee_names,
                'creation_date': task.get('creation_date'),
                'deadline': task.get('deadline'),
                'status': task.get('status'),
                'task_id': task.get('_id'),
                'creator_id': task.get('creator_id'),
                'blocking': task.get('blocking'),
                'hours_to_complete': task.get('hours_to_complete'),
                'priority': task.get('priority'),
                'priority_score': task.get('priority_score'),
                'dependency_ids': task.get('dependency_ids'),
                'dependency_titles': dependency_titles,
                'start_time': task.get('start_time'),
                'end_time': task.get('end_time'),
            })

    return all_tasks

# Get all the tasks assigned to the user
def _get_assigned_tasks(token):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    u_id = loop.run_until_complete(db.get_uid_from_token(token))
    loop.close()

    if u_id is None:
        raise Unauthorized('You are not logged in!')

    return _get_connected_tasks(u_id)
