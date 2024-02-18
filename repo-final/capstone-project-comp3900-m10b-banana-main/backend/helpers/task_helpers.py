"""
Helper functions for tasks.
"""

import asyncio
from datetime import datetime, timezone, timedelta
import itertools
import math
from werkzeug.exceptions import Forbidden, UnprocessableEntity
from backend.database.database import MongoDBAccess
from backend.helpers.backend_helpers import _get_connected_tasks, _get_all_database_tasks

# Check the title is valid
def check_title(title):
    if len(title.strip()) < 1 or len(title.strip()) > 20:
            raise UnprocessableEntity('Title must be between 1 and 20 characters!')

# Check the description is valid
def check_description(description):
    if len(description.strip()) < 1 or len(description.strip()) > 200:
            raise UnprocessableEntity('Description must be between 1 and 200 characters!')

# Check the deadline is valid
def check_deadline(deadline):
    if deadline != '':
        try:
            deadline = datetime.strptime(deadline, '%Y-%m-%dT%H:%M:%S.%fZ')
        except:
            raise UnprocessableEntity('Deadline must be in the format of "YYYY-MM-DDTHH:MM:SS:FFFFFFZ"!')

# Checks the assignee is a connection of the user
# If no assignees are set, set the assignee to the creator
def check_assignees(assignee_ids, creator_id, connected_ids):
    if len(assignee_ids) == 0:
        return [creator_id]
    
    for id in assignee_ids:
        if id not in connected_ids and id != creator_id:
            raise Forbidden('Can only assign connected task masters to task!')
    return assignee_ids

# Gets the task from a given task id
def get_task_from_id(tasks, id):
    for task in tasks:
        if task['task_id'] == id:
            return task
    return None

# Gets all the dependencies from a given task
def get_all_dependencies(array, tasks, id):
    task = get_task_from_id(tasks, id)

    array.append(task['task_id'])

    for block_id in task['dependency_ids']:
        if block_id not in array:
            get_all_dependencies(array, tasks, block_id)

# Checks the dependencies of a task to ensure that there is no loops in the dependencies.
def check_dependencies(tasks, task_id, dependency_ids):
    array = []
    for id in dependency_ids:
        get_all_dependencies(array, tasks, id)
        if task_id in array:
            raise UnprocessableEntity('Cannot add a circular task dependency!')

# Check a user can change the status of a task
def check_change_status_permission(task, u_id):
    creator_id = task.get('creator_id')
    assignee_ids = task.get('assignee_ids')
    if u_id != creator_id and u_id not in assignee_ids:
            raise Forbidden('You do not have permission to change the task status!')

# Check a user can change the priority of a task
def check_change_priority_permission(task, u_id):
    creator_id = task.get('creator_id')
    assignee_ids = task.get('assignee_ids')
    if u_id != creator_id and u_id not in assignee_ids:
            raise Forbidden('You do not have permission to change the task status!')

# Create the document that represents a task to be stored in the database
def create_task_document(title, description, creator_token, assignee_ids, hours_to_complete, priority, dependency_ids, deadline=''):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    num_tasks = loop.run_until_complete(db.count_collection('Tasks'))
    creator_id = loop.run_until_complete(db.get_uid_from_token(creator_token))
    loop.close()

    return {
        '_id': num_tasks,
        'title': title,
        'description': description,
        'creator_id': creator_id,
        'assignee_ids': assignee_ids,
        'creation_date': datetime.now(),
        'deadline': deadline,
        'status': 'Not Started',
        'blocking': [],
        'priority': priority,
        'priority_score': 0,
        'hours_to_complete': hours_to_complete,
        'dependency_ids': dependency_ids,
        'start_time' : None,
        'end_time' : None,
    }

# Format the deadline returned from the backend into a datetime object
def format_deadline(backend_deadline):
    # backend_deadline = '2022-11-24T11:58:00.000Z'
    # backend_deadline -> localtime_deadline -> formatted_localtime_deadline
    # formatted_localtime_deadline = '24/11/2022 11:58 am'
    localtime_deadline = datetime.strptime(backend_deadline, '%Y-%m-%dT%H:%M:%S.%fZ')
    localtime_deadline = localtime_deadline.replace(tzinfo=timezone.utc).astimezone(tz=None)

    formatted_time = datetime.strptime(f'{localtime_deadline.hour}:{localtime_deadline.minute}', '%H:%M')
    formatted_time = formatted_time.strftime('%I:%M %p').lstrip('0')

    formatted_localtime_deadline = f'{str(localtime_deadline.day).zfill(2)}/{str(localtime_deadline.month).zfill(2)}/{localtime_deadline.year} {str(formatted_time).lower()}'
    return formatted_localtime_deadline

# Sort a tasks list based on deadline
def deadline_sort(tasks):
    empty = []
    allocated = []
    for task in tasks:
        if task['deadline'] == '':
            empty.append(task)
        else:
            allocated.append(task)

    sorted_tasks = sorted(allocated, key=lambda x: x['deadline']) + empty
    return sorted_tasks

# Assigns priority statuses to numeric values
def priority_value(task):
    if task.get('priority') == "Low":
        return 1
    elif task.get('priority') == "Medium":
        return 2
    elif task.get('priority') == "High":
        return 3

# Calculates a numeric value based on if the user completes tasks before or after the expected hours to complete
def calculate_assignee_buffer(assigned_tasks):
    total_buffer = 0
    completed_tasks = 0
    for task in assigned_tasks:
        if task.get('status') == 'Completed' and task.get('start_time'):
            time_taken = math.ceil(timedelta.total_seconds(task.get('end_time') - task.get('start_time')) / 3600)
            buffer = time_taken - int(task.get('hours_to_complete'))
            if buffer >= 0:
                total_buffer += buffer
            completed_tasks += 1

    if completed_tasks == 0:
        return 0
    return math.ceil(total_buffer / completed_tasks)

# Calcuates the average buffer of assignees of a task
# Removed: good functionality but at the cost of a extremely long calculation time
# def calculate_average_assignees_buffer(task):
#     sum = 0
#     for id in task.get('assignee_ids'):
#         assignee_tasks = _get_connected_tasks(id)
#         sum += calculate_assignee_buffer(assignee_tasks)

#     if len(task.get('assignee_ids')) == 0:
#         return 0
#     return math.ceil(sum / len(task.get('assignee_ids')))

# Calculate a numeric value used to determin the level of priority of a task
def calculate_priority_scores(tasks, buffer):
    for task in tasks:
        # buffer = calculate_average_assignees_buffer(task)
        time_estimated = int(task.get('hours_to_complete')) + buffer

        if task.get('deadline') == '':
            time_remaining = 100000 / priority_value(task)
        else:
            localtime_deadline = datetime.strptime(task.get('deadline'), '%Y-%m-%dT%H:%M:%S.%fZ')
            time_remaining = timedelta.total_seconds(localtime_deadline - datetime.utcnow()) / 3600

        if time_remaining <= 0:
            time_remaining = 0.01 / priority_value(task)

        task['priority_score'] = priority_value(task) * (time_estimated / time_remaining)

# Represent the tasks list containing all the tasks in the database as an undirected graph
# Each vertex represents a task
# Each edge represents an undirected dependency
def tasks_list_to_undirected_graph(db_tasks):
    db_tasks_count = len(db_tasks)
    db_tasks_graph_undirected = [[0 for x in range(db_tasks_count + 3)] for y in range(db_tasks_count)]

    for task in db_tasks:
        db_tasks_graph_undirected[task.get('task_id')][db_tasks_count] = task.get('priority_score')
        for dependency_id in task.get('dependency_ids'):
            db_tasks_graph_undirected[task.get('task_id')][dependency_id] = 1
            db_tasks_graph_undirected[dependency_id][task.get('task_id')] = 1

    return db_tasks_graph_undirected

# Flood fill a subgraph using depth first search and a sticky default mutable object (visited=[])
def _dfs(graph, vertex, label, visited=[]):
    if vertex in visited:
        return

    cols = len(graph[vertex])
    graph[vertex][cols - 2] = label
    visited.append(vertex)

    for i in range(cols - 3):
        if graph[vertex][i] and i not in visited:
            _dfs(graph, i, label)
    return

# Flood fill a graph to identify all of its subgraphs
# Each subgraph represents a task cluster
def flood_fill(graph):
    _dfs.__defaults__[0][:] = []
    rows = len(graph)
    for i in range(rows):
        _dfs(graph, i, i + 1)

# Calculate the average priority score for each task cluster (subgraph)
def average_priority_score(graph):
    rows = len(graph)
    cols = len(graph[0])

    for label in range(1, rows + 1):
        task_cluster = []
        total_priority_score = 0
        for i in range(rows):
            if graph[i][cols - 2] == label:
                task_cluster.append(i)
                total_priority_score += graph[i][cols - 3]

        if len(task_cluster) == 0:
            average_priority_score = 0
        else:
            average_priority_score = total_priority_score / len(task_cluster)

        for j in task_cluster:
            graph[j][cols - 1] = average_priority_score

# Convert the undirected graph to a directed graph
# Each vertex represents a task
# Each edge represents a directed dependency
def undirected_to_directed_graph(db_tasks, graph):
    for task in db_tasks:
        for dependency_id in task.get('dependency_ids'):
            graph[dependency_id][task.get('task_id')] = 0

# Check if a vertex row is a source vertex (no incoming edges)
def check_is_source_vertex(vertex_row):
    cols = len(vertex_row)
    if all(not edge for edge in itertools.islice(vertex_row, cols - 3)):
        return True
    return False

# Topological sort the directed graph which orders the tasks based on
# Their dependencies and their average task cluster priority score
def topological_sort(graph):
    sorted_vertices = []
    source_vertices = []

    rows = len(graph)
    cols = len(graph[0])

    for i in range(rows):
        if check_is_source_vertex(graph[i]):
            source_vertices.append({
                'task_id': i,
                'average_priority_score': graph[i][cols - 1],
                'priority_score': graph[i][cols - 3],
            })

    while source_vertices:
        highest_priority_vertex = max(source_vertices, key=lambda v: (v['average_priority_score'], v['priority_score']))
        source_vertices.remove(highest_priority_vertex)
        sorted_vertices.append(highest_priority_vertex.get('task_id'))

        for i in range(rows):
            if graph[i][highest_priority_vertex.get('task_id')]:
                graph[i][highest_priority_vertex.get('task_id')] = 0
                if check_is_source_vertex(graph[i]):
                    source_vertices.append({
                        'task_id': i,
                        'average_priority_score': graph[i][cols - 1],
                        'priority_score': graph[i][cols - 3],
                    })

    return sorted_vertices

# Convert the sorted vertices back to a tasks list
def vertices_to_tasks_list(vertices, db_tasks):
    tasks = []
    for vertex in vertices:
        tasks.append(db_tasks[vertex])
    return tasks

# Remove each task from the sorted database tasks list that is not in the required tasks list
def remove_unneeded_tasks(sorted_db_tasks, required_tasks):
    required_tasks_ids = [required_task.get('task_id') for required_task in required_tasks]
    sorted_required_tasks = []
    for task in sorted_db_tasks:
        if task.get('task_id') in required_tasks_ids and task.get('status') != 'Completed':
            sorted_required_tasks.append(task)
    return sorted_required_tasks

# Sort a tasks list based on each task's priority score as well as its dependencies
def priority_sort(tasks, buffer):
    db_tasks = _get_all_database_tasks()
    calculate_priority_scores(db_tasks, buffer)

    db_tasks_graph = tasks_list_to_undirected_graph(db_tasks)
    flood_fill(db_tasks_graph)
    average_priority_score(db_tasks_graph)
    undirected_to_directed_graph(db_tasks, db_tasks_graph)

    sorted_vertices = topological_sort(db_tasks_graph)
    sorted_db_tasks = vertices_to_tasks_list(sorted_vertices, db_tasks)
    sorted_tasks = remove_unneeded_tasks(sorted_db_tasks, tasks)

    return sorted_tasks
