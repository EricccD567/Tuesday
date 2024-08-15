"""
Helper functions for users.
"""

import asyncio
from datetime import datetime, timedelta
from database.database import MongoDBAccess
from helpers.backend_helpers import _get_connected_tasks

# Calculate the workload percentage of a user
def get_workload(uid):
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    user = loop.run_until_complete(db.get_user_from_uid(uid))
    assigned_tasks = _get_connected_tasks(uid)

    # Only interested in the last 7 days
    current_date = datetime.now()
    end_of_week = current_date + timedelta(days=7)
    working_hours = float(0)

    for task in assigned_tasks:
        if task.get('deadline') != '':
            datetime_object = datetime.strptime(task.get('deadline'), '%Y-%m-%dT%H:%M:%S.%fZ')
            if current_date <= datetime_object <= end_of_week:
                if task.get('status') == "Not Started" or task.get('status') == "In Progress":
                    working_hours = working_hours + float(task.get('hours_to_complete'))

    workload = int((working_hours / float(user.get('weekly_work_hours'))) * 100)
    loop.close()
    return workload
