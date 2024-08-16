import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import {
  TaskBoardHeader,
  TaskBoardHeaderConnected,
  TaskBoardTable,
} from '../components';

function TaskBoard(props) {
  const navigate = useNavigate();

  const { redirectUnauthorized } = props;

  // checks if the taskboard 'My Tasks' switch should be initially on if the user visits this page via the profile page
  const [searchParams] = useSearchParams();
  const isAssigned = searchParams.get('assigned');

  // checks if the taskboard is of the current user or a connected user
  const currentUserId = localStorage.getItem('u_id');
  const urlParams = useParams();
  const urlUserId = urlParams['userId'];
  const isSelf = urlUserId === undefined || urlUserId === currentUserId;

  // state variable to store all tasks to be displayed
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    // redirect user to login page if they are not logged in
    if (redirectUnauthorized()) {
      navigate('/login');
      return;
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {isSelf ? (
        // header for logged in user's taskboard
        <TaskBoardHeader
          setAllTasks={setAllTasks}
          isAssigned={isAssigned}
        />
      ) : (
        // header for connected task master's taskboard
        <TaskBoardHeaderConnected
          setAllTasks={setAllTasks}
          urlUserId={urlUserId}
        />
      )}
      {/* taskboard contents */}
      <TaskBoardTable allTasks={allTasks} />
    </>
  );
}

export default TaskBoard;

// allTasks = [
//   {
//     task_id: 1,
//     title: "Form group",
//     description: "find 4 other people to form a group with",
//     deadline: "2017-05-24T00:30:00.000Z",
//     creation_date: 2022 - 10 - 31T11: 18: 06.380 + 00: 00,
//     status: "Completed",
//     assignee_names: ["Brenda", "Tom"],
//     assignee_ids: [2, 3],
//     hours_to_complete: '8',
//     priority: 'low',
//     dependency_ids: [2, 3],
//     dependency_titles: ['Task 2 Title', 'Task 3 Title'],
//   },
//   {
//     task_id: 2,
//     title: "Write proposal",
//     description: "write something",
//     deadline: "2017-05-24T00:30:00.000Z",
//     creation_date: 2022 - 10 - 31T11: 18: 06.380 + 00: 00,
//     status: "In Progress",
//     assignee_names: ["Brenda", "Tom"],
//     assignee_ids: [2, 3],
//     hours_to_complete: '8',
//     priority: 'low',
//     dependency_ids: [2, 3],
//     dependency_titles: ['Task 2 Title', 'Task 3 Title'],
//   },
//   {
//     task_id: 3,
//     title: "Start coding",
//     description: "this is a description",
//     deadline: "",
//     creation_date: 2022 - 10 - 31T11: 18: 06.380 + 00: 00,
//     status: "In Progress",
//     assignee_names: ["Brenda", "Tom"],
//     assignee_ids: [2, 3],
//     hours_to_complete: '8',
//     priority: 'low',
//     dependency_ids: [2, 3],
//     dependency_titles: ['Task 2 Title', 'Task 3 Title'],
//   }
// ]
