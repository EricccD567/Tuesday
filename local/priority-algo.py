import itertools

# represent the tasks list containing all the tasks in the database as an undirected graph
# each vertex represents a task
# each edge represents an undirected dependency
def tasks_list_to_graph_undirected(db_tasks):
    db_tasks_count = len(db_tasks)
    db_tasks_graph_undirected = [[0 for x in range(db_tasks_count + 3)] for y in range(db_tasks_count)]

    for task in db_tasks:
        db_tasks_graph_undirected[task.get('task_id')][db_tasks_count] = task.get('priority_score')
        for dependency_id in task.get('dependency_ids'):
            db_tasks_graph_undirected[task.get('task_id')][dependency_id] = 1
            db_tasks_graph_undirected[dependency_id][task.get('task_id')] = 1

    return db_tasks_graph_undirected

# flood fill a subgraph using depth first search and a sticky default mutable object (visited=[])
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

# flood fill a graph to identify all of its subgraphs
# each subgraph represents a task cluster
def flood_fill(graph):
    _dfs.__defaults__[0][:] = []
    rows = len(graph)
    for i in range(rows):
        _dfs(graph, i, i + 1)

# calculate the average priority score for each task cluster (subgraph)
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

# convert the undirected graph to a directed graph
# each vertex represents a task
# each edge represents a directed dependency
def undirected_to_directed_graph(db_tasks, graph):
    for task in db_tasks:
        for dependency_id in task.get('dependency_ids'):
            graph[dependency_id][task.get('task_id')] = 0

# check if a vertex row is a source vertex (no incoming edges)
def check_is_source_vertex(vertex_row):
    cols = len(vertex_row)
    if all(not edge for edge in itertools.islice(vertex_row, cols - 3)):
        return True
    return False

# topological sort the directed graph which orders the tasks based on
# their dependencies and their average task cluster priority score
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

# convert the sorted vertices back to a tasks list
def vertices_to_tasks_list(vertices, db_tasks):
    tasks = []
    for vertex in vertices:
        tasks.append(db_tasks[vertex])
    return tasks

# remove each task from the sorted database tasks list that is not in the required tasks list
def remove_unneeded_tasks(sorted_db_tasks, required_tasks):
    for task in sorted_db_tasks:
        if task not in required_tasks:
            sorted_db_tasks.remove(task)
    return sorted_db_tasks



# test
def create_task(task_id, dependency_ids, priority_score):
    return {
        'task_id': task_id,
        'dependency_ids': dependency_ids,
        'priority_score': priority_score,
    }

db_tasks = []
tasks = []

task_0 = create_task(0, [], 6)
db_tasks.append(task_0)
tasks.append(task_0)

task_1 = create_task(1, [0], 5)
db_tasks.append(task_1)
tasks.append(task_1)

task_2 = create_task(2, [0], 8)
db_tasks.append(task_2)
tasks.append(task_2)

task_3 = create_task(3, [0, 1], 2)
db_tasks.append(task_3)
tasks.append(task_3)

task_4 = create_task(4, [], 1)
db_tasks.append(task_4)
tasks.append(task_4)

task_5 = create_task(5, [], 10)
db_tasks.append(task_5)
tasks.append(task_5)

task_6 = create_task(6, [], 4)
db_tasks.append(task_6)

task_7 = create_task(7, [6], 10)
db_tasks.append(task_7)
tasks.append(task_7)

task_8 = create_task(8, [], 1)
db_tasks.append(task_8)
tasks.append(task_8)

task_9 = create_task(9, [8], 4)
db_tasks.append(task_9)
tasks.append(task_9)

task_10 = create_task(10, [], 4)
db_tasks.append(task_10)



debug = 1

# got tasks
# get db_tasks
db_tasks = sorted(db_tasks, key=lambda t: t['task_id'])
if debug:
    print('Required Tasks: [')
    print(*tasks, sep=',\n')
    print(']\n')
    print('Database Tasks: [')
    print(*db_tasks, sep=',\n')
    print(']\n')

db_tasks_graph = tasks_list_to_graph_undirected(db_tasks)
flood_fill(db_tasks_graph)
average_priority_score(db_tasks_graph)
undirected_to_directed_graph(db_tasks, db_tasks_graph)
if debug:
    print('Database Tasks Graph: [')
    print(*db_tasks_graph, sep=',\n')
    print(']\n')

sorted_vertices = topological_sort(db_tasks_graph)
print(sorted_vertices)
print('\n')
sorted_db_tasks = vertices_to_tasks_list(sorted_vertices, db_tasks)
print(sorted_db_tasks)
print('\n')
sorted_tasks = remove_unneeded_tasks(sorted_db_tasks, tasks)
print(sorted_tasks)
