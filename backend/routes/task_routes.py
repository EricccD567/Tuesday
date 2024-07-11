"""
Task HTTP Flask server routes.
"""

from flask import Blueprint, request, jsonify
from werkzeug.exceptions import HTTPException
from backend.helpers.backend_helpers import _get_all_tasks, _get_assigned_tasks
from backend.common.Task import _create_task, _set_task_status, _set_priority, _edit_task, _search_tasks, _sort_tasks

task = Blueprint('task', __name__, url_prefix='/task/')

'''
Create a new task and add to database
Method: Post
Headers: Authorization
Data: title, description, assignee_ids, deadline, hours_to_complete, priority, dependency_ids
'''
@task.route("/create", methods=['POST'])
def create_task():
    data = request.get_json()
    title = data['title']
    description = data['description']
    assignee_ids = data['assignee_ids']
    deadline = data['deadline']
    hours_to_complete = data['hours_to_complete']
    priority = data['priority']
    dependency_ids = data['dependency_ids']
    creator_token = request.headers.get('Authorization')

    return _create_task(title, description, assignee_ids, deadline, hours_to_complete, priority, dependency_ids, creator_token)

'''
Update a task status
Method: Post
Headers: Authorization
Data: new_status, task_id
'''
@task.route("/status", methods=['POST'])
def set_task_status():
    data = request.get_json()
    new_status = data['status']
    task_id = data['task_id']
    token = request.headers.get('Authorization')

    return _set_task_status(new_status, task_id, token)

'''
Update a task status
Method: Post
Headers: Authorization
Data: task_id, new_priority
'''
@task.route("/priority", methods=['POST'])
def set_priority():
    data = request.get_json()
    new_priority = data['priority']
    task_id = data['task_id']
    token = request.headers.get('Authorization')

    return _set_priority(new_priority, task_id, token)

'''
Edit task
Method: Post 
Headers: Authorization
Data: task_id, title, description, assignee_ids, deadline, hours_to_complete, dependency_ids
'''
@task.route("/edit", methods=['POST'])
def edit_task():
    data = request.get_json()
    task_id = data['task_id']
    title = data['title']
    description = data['description']
    assignee_ids = data['assignee_ids']
    deadline = data['deadline']
    hours_to_complete = data['hours_to_complete']
    dependency_ids = data['dependency_ids']
    token = request.headers.get('Authorization')

    return _edit_task(task_id, title, description, assignee_ids, deadline, hours_to_complete, dependency_ids, token)

'''
Get list of all tasks
Method: Get
Headers: Authorization
Data: N/A
'''
@task.route("/alltasks", methods=['GET'])
def get_all_tasks():
    # iterate through all tasks in database and extract details
    # find the first name of each task's assignees based on the assignee_ids list
    token = request.headers.get('Authorization')

    try:
        return _get_all_tasks(token)
    except HTTPException as e:
        return jsonify(message=e.description, cause=str(e)), e.code

'''
Get list of assigned tasks
Method: Get
Headers: Authorization
Data: N/A
'''
@task.route("/assignedtasks", methods=['GET'])
def get_assigned_tasks():
    token = request.headers.get('Authorization')

    try:
        return _get_assigned_tasks(token)
    except HTTPException as e:
        return jsonify(message=e.description, cause=str(e)), e.code

'''
Get list of tasks that match search query
Method: Post
Headers: Authorization
Data: tasklist_type, query
'''
@task.route("/search", methods=['POST'])
def search():
    data = request.get_json()
    token = request.headers.get('Authorization')
    tasklist_type = data['tasklist_type']
    query = data['search_query']

    try:
        return _search_tasks(token, query, tasklist_type)
    except HTTPException as e:
        return jsonify(message=e.description, cause=str(e)), e.code

'''
Sorts tasks based on given parameters
Method: Post
Headers: Authorization
Data: target_id, tasklist_type, sort_type
'''
@task.route("/sort", methods=['POST'])
def sort_tasks():
    data = request.get_json()
    token = request.headers.get('Authorization')
    target_id = data['target_id']
    tasklist_type = data['tasklist_type']
    sort_type = data['sort_type']

    try:
        return _sort_tasks(token, target_id, tasklist_type, sort_type)
    except HTTPException as e:
        return jsonify(message=e.description, cause=str(e)), e.code
