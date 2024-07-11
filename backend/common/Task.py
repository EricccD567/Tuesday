"""
Task functions for creating a task, editing a task and its status and priority, task searching and task sorting.
"""

import asyncio
from datetime import datetime
from flask import jsonify
from werkzeug.exceptions import Forbidden, HTTPException
from backend.database.database import MongoDBAccess
from backend.helpers.backend_helpers import _get_all_tasks, _get_assigned_tasks, _get_connected_tasks
from backend.helpers.task_helpers import check_title, check_description, check_deadline, check_assignees, check_dependencies, check_change_status_permission, check_change_priority_permission, create_task_document, format_deadline, deadline_sort, calculate_assignee_buffer, priority_sort

# Creates a task populated with values passed into the function
def _create_task(title, description, assignee_ids, deadline, hours_to_complete, priority, dependency_ids, creator_token):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        check_title(title)
        check_description(description)
        check_deadline(deadline)
        creator = loop.run_until_complete(db.get_user_from_token(creator_token))
        assignee_ids = check_assignees(assignee_ids, creator.get('_id'), creator.get('connections'))

        document = create_task_document(title, description, creator_token, assignee_ids, hours_to_complete, priority, dependency_ids, deadline)
        loop.run_until_complete(db.insert_document('Tasks', document))

        loop.close()
        return {}
    except HTTPException as e:
        loop.close()
        return jsonify(message=e.description, cause=str(e)), e.code

# Set the status of a task given the requestor has permission
def _set_task_status(new_status, task_id, token):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        u_id = loop.run_until_complete(db.get_uid_from_token(token))
        task = loop.run_until_complete(db.get_task_from_tid(task_id))
        check_change_status_permission(task, u_id)

        task['status'] = new_status
        if new_status == "In Progress":
            task['start_time'] = datetime.now()
        if new_status == "Completed":
            task['end_time'] = datetime.now()
        loop.run_until_complete(db.edit_document('Tasks', task_id, task))

        loop.close()
        return {}
    except HTTPException as e:
        loop.close()
        return jsonify(message=e.description, cause=str(e)), e.code

# Changes the priority status of a task to the provided value given the requestor has permission
def _set_priority(new_priority, task_id, token):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        u_id = loop.run_until_complete(db.get_uid_from_token(token))
        task = loop.run_until_complete(db.get_task_from_tid(task_id))
        check_change_priority_permission(task, u_id)

        task['priority'] = new_priority
        loop.run_until_complete(db.edit_document('Tasks', task_id, task))

        loop.close()
        return {}
    except HTTPException as e:
        loop.close()
        return jsonify(message=e.description, cause=str(e)), e.code

# Edit a task to be defined by the passed in values given the requestor has permission
def _edit_task(task_id, title, description, assignee_ids, deadline, hours_to_complete, dependency_ids, token):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        u_id = loop.run_until_complete(db.get_uid_from_token(token))
        task = loop.run_until_complete(db.get_task_from_tid(task_id))
        tasks = _get_all_tasks(token)
        check_title(title)
        check_description(description)
        check_deadline(deadline)
        check_dependencies(tasks, task_id, dependency_ids)
        if u_id != task.get('creator_id') and u_id not in task.get('assignee_ids'):
            raise Forbidden('You do not have permission to edit this task')

        editted_task = {
            '_id': task_id,
            'title': title,
            'description': description,
            'creator_id': task.get('creator_id'),
            'assignee_ids': assignee_ids,
            'creation_date': task.get('creation_date'),
            'deadline': deadline,
            'status': task.get('status'),
            'blocking': task.get('blocking'),
            'priority': task.get('priority'),
            'priority_score': task.get('priority_score'),
            'hours_to_complete': hours_to_complete,
            'dependency_ids': dependency_ids,
            'start_time': task.get('start_time'),
            'end_time': task.get('end_time'),
        }
        loop.run_until_complete(db.edit_document('Tasks', task_id, editted_task))

        loop.close()
        return {}
    except HTTPException as e:
        loop.close()
        return jsonify(message=e.description, cause=str(e)), e.code

# Search the specified tasklist for entries that contain the query as a substring
def _search_tasks(token, query, tasklist_type):
    tasks = []
    if (tasklist_type == 'assigned'):
        tasks = _get_assigned_tasks(token)
    elif (tasklist_type == 'all'):
        tasks = _get_all_tasks(token)

    filtered_tasks = []
    query = query.lower()
    for task in tasks:
        if query.isnumeric():
            if task['task_id'] == int(query):
                filtered_tasks.append(task)
                continue
        if query in task['title'].lower():
            filtered_tasks.append(task)
            continue
        if query in task['description'].lower():
            filtered_tasks.append(task)
            continue
        if task.get('deadline') is not None and task.get('deadline') != '':
            if query in format_deadline(task.get('deadline')):
                filtered_tasks.append(task)
                continue

    return filtered_tasks

# Sort tasks based on the type passed into the function
def _sort_tasks(token, target_id, tasklist_type, sort_type):
    tasks = []
    if tasklist_type == 'all':
        tasks = _get_all_tasks(token)
    elif tasklist_type == 'assigned':
        tasks = _get_assigned_tasks(token)
    elif tasklist_type == 'connected':
        tasks = _get_connected_tasks(target_id)

    sorted_tasks = []
    if sort_type == 'creation':
        sorted_tasks = sorted(tasks, key=lambda x: x['creation_date'])
    elif sort_type == 'deadline':
        sorted_tasks = deadline_sort(tasks)
    elif sort_type == 'priority':
        if tasklist_type == 'all' or tasklist_type == 'assigned':
            assigned_tasks = _get_assigned_tasks(token)
        elif tasklist_type == 'connected':
            assigned_tasks = _get_connected_tasks(target_id)
        buffer = calculate_assignee_buffer(assigned_tasks)
        sorted_tasks = priority_sort(tasks, buffer)

    return sorted_tasks
