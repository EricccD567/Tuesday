"""
Report functions for generating the graphs for the self-reflection feature.
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import asyncio
import numpy as np
from datetime import datetime, time, timedelta
from ..database.database import MongoDBAccess
import base64
from backend.helpers.backend_helpers import _get_assigned_tasks

def report_setup(token):
    # Mongo setup
    db = MongoDBAccess()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    user = loop.run_until_complete(db.get_user_from_token(token))
    loop.close()

    # Get all the tasks for the user
    filtered_tasks = _get_assigned_tasks(token)

    task_allocated_time = []

    # Find out the sum of all the task durations and append hour estimates to task_allocated_time
    for task in filtered_tasks:
        task_allocated_time.append(int(task.get('hours_to_complete')))

    task_titles = []
    for task in filtered_tasks:
        task_titles.append(task.get('title'))

    task_durations, completed_tasks = task_inprogress_duration(filtered_tasks)

    completed_task_titles = []
    for task in completed_tasks:
        completed_task_titles.append(task.get('title'))

    completed_tasks_allocated_time = []
    for task in completed_tasks:
        completed_tasks_allocated_time.append(int(task.get('hours_to_complete')))

    task_converted = []
    for task in task_durations:
        task_converted.append(task.total_seconds()//3600)

    # Plot 1
    plot_estimate_vs_actual_times(completed_task_titles, completed_tasks_allocated_time, task_converted)

    # Plot 2
    tasks_with_deadlines, deadlines, end_times, task_early_or_late = deadline_compute(filtered_tasks)
    deadline_task_titles = []
    for task in tasks_with_deadlines:
        deadline_task_titles.append(task.get('title'))
    before_or_after_deadline(tasks_with_deadlines, deadline_task_titles, deadlines, end_times, task_early_or_late)

    # Plot 3
    workload_activity_list, date_store = workload_calculate(user, tasks_with_deadlines, deadlines)
    workload_plot(workload_activity_list, date_store)

    with open('backend/plots/plot_1.jpeg', 'rb') as im1:
        plot_1 = base64.b64encode(im1.read()).decode('utf-8')
    with open('backend/plots/plot_2.jpeg', 'rb') as im2:
        plot_2 = base64.b64encode(im2.read()).decode('utf-8')
    with open('backend/plots/plot_3.jpeg', 'rb') as im3:
        plot_3 = base64.b64encode(im3.read()).decode('utf-8')
    return {
        'plot_1': str(plot_1),
        'plot_2': str(plot_2),
        'plot_3': str(plot_3),
    }

def deadline_compute(tasks):
    # Check what tasks were done before or after the deadline
    deadline_tasks = []
    tasks_with_deadlines = []
    end_times = []
    task_early_or_late = []
    for task in tasks:
        if task.get('deadline') != '' and task.get('end_time') is not None and task.get('start_time') is not None:
            tasks_with_deadlines.append(task)
            datetime_object = datetime.strptime(task.get('deadline'), '%Y-%m-%dT%H:%M:%S.%fZ')  # '2022-12-15T11:00:00.000Z'
            datetime_object = datetime_object - timedelta(hours=1, minutes=0, seconds=0)
            deadline_tasks.append(datetime_object)
            end_times.append(task.get('end_time'))
            if datetime_object >= task.get('end_time'):
                task_early_or_late.append("Before")
            else:
                task_early_or_late.append("After")

    return tasks_with_deadlines, deadline_tasks, end_times, task_early_or_late

def workload_calculate(user, tasks, deadlines):
    workload_activity_list = []

    time = datetime.now()
    date_year = time.year
    date_month = time.month
    date_day = time.day

    date_store = []
    for i in range(7):
        current_date = datetime(date_year, date_month, date_day, 9, 0, 0) - timedelta(days=i)
        date_store.append(current_date)
        end_of_week = current_date + timedelta(days=7)
        working_hours = float(0)
        for j in range(len(tasks)):
            if current_date <= deadlines[j] <= end_of_week:
                working_hours = working_hours + float(tasks[j].get('hours_to_complete'))
        workload = round(((working_hours / float(user.get('weekly_work_hours'))) * 100), 2)
        workload_activity_list.append(workload)

    return workload_activity_list, date_store

def plot_estimate_vs_actual_times(task_titles, task_allocated_time, task_converted):
    x = np.arange(len(task_titles))     # the label locations
    width = 0.35                        # the width of the bars

    fig, ax = plt.subplots()
    rects1 = ax.bar(x - width/2, task_allocated_time, width, label='Estimated Time')
    rects2 = ax.bar(x + width/2, task_converted, width, label='Actual task durations')

    # Add some text for labels, title and custom x-axis tick labels, etc.
    ax.set_ylabel('Hours')
    ax.set_xlabel('Tasks')
    ax.set_xticks(x, task_titles)
    ax.legend()
    ax.bar_label(rects1, padding=3)
    ax.bar_label(rects2, padding=3)
    fig.tight_layout()
    fig.set_size_inches(20, 10)
    fig.savefig('backend/plots/plot_1.jpeg')

def before_or_after_deadline(tasks, task_titles, deadline_tasks, end_times, task_early_or_late):
    # define figure and axes
    fig, ax = plt.subplots()

    # create values for table
    table_data = [['Task Title', 'Deadline', 'Completion date', 'Before/After deadline']]
    for i in range(len(tasks)):
        if tasks[i].get('deadline') != '':
            table_data.append([str(task_titles[i]), str(deadline_tasks[i]), str(end_times[i]), str(task_early_or_late[i])])

    # create table
    table = ax.table(cellText=table_data, loc='center', cellLoc='center')
    for i in range(4):
        table[(0, i)].set_facecolor("#CD96CD")

    # modify table
    table.auto_set_font_size(False)
    table.set_fontsize(15)
    table.scale(1,2)
    ax.axis('off')

    # display table
    fig.set_size_inches(20, 10)
    fig.savefig('backend/plots/plot_2.jpeg')

def workload_plot(workload_activity_list, date_store):
    date_store.reverse()
    workload_activity_list.reverse()

    date_entries = []
    for date in date_store:
        year = str(date.year)
        month = str(date.month)
        day = str(date.day)
        final_date = day + '-' + month + '-' + year
        date_entries.append(final_date)

    f = plt.figure()
    f.set_figwidth(20)
    f.set_figheight(10)
    plt.plot(date_entries, workload_activity_list)
    plt.xlabel('Date')
    plt.ylabel('Workload Percentage')
    f.savefig('backend/plots/plot_3.jpeg')

# Working hours are only counted between 9-5
def task_inprogress_duration(tasks):
    time_diff = []
    completed_tasks = []
    for task in tasks:
        if task.get('end_time') is not None and task.get('start_time') is not None: # Only calculate for tasks that have actually completed
            completed_tasks.append(task)
            end_time = task.get('end_time')
            start_time = task.get('start_time')
            if end_time is not None and start_time is not None:
                diff = end_time - start_time
            else:
                diff = 0
            start_year = str(start_time.year).zfill(4)
            start_month = str(start_time.month).zfill(2)
            start_day = str(start_time.day).zfill(2)
            end_year = str(end_time.year).zfill(4)
            end_month = str(end_time.month).zfill(2)
            end_day = str(end_time.day).zfill(2)
            days_between = np.busday_count(f'{start_year}-{start_month}-{start_day}', f'{end_year}-{end_month}-{end_day}')
            if days_between == 0:
                time_diff.append(diff)
            elif days_between == 1:
                first_day_start = timedelta(hours=start_time.hour, minutes=start_time.minute, seconds=start_time.second)
                first_day_end = timedelta(hours=17, minutes=0, seconds=0)
                first_day_delta = first_day_end - first_day_start

                second_day_start = timedelta(hours=end_time.hour, minutes=end_time.minute, seconds=end_time.second)
                second_day_end = timedelta(hours=9, minutes=0, seconds=0)
                second_day_delta = second_day_start - second_day_end

                delta_single = first_day_delta + second_day_delta
                time_diff.append(delta_single)
            else:
                first_day_start = timedelta(hours=start_time.hour, minutes=start_time.minute, seconds=start_time.second)
                first_day_end = timedelta(hours=17, minutes=0, seconds=0)
                first_day_delta = first_day_end - first_day_start

                second_day_start = timedelta(hours=end_time.hour, minutes=end_time.minute, seconds=end_time.second)
                second_day_end = timedelta(hours=9, minutes=0, seconds=0)
                second_day_delta = second_day_start - second_day_end

                delta_first_last = first_day_delta + second_day_delta

                days_between = int(days_between) - 1
                in_between_hours = days_between * 6
                in_between_delta = timedelta(hours=in_between_hours, minutes=0, seconds=0)
                total_time = in_between_delta + delta_first_last

                time_diff.append(total_time)

    return time_diff, completed_tasks
