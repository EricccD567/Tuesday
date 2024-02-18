import React, { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TaskDialog from './TaskDialog';
import { TaskStatusDropdown, TaskBoardPriorityStatus } from '../components';

function Task({ task }) {
  // set canEdit for a task to be true if the user is its creator or one of its assignees
  let canEdit = false;
  let u_id = localStorage.getItem('u_id');
  u_id = +u_id;
  if (u_id === task['creator_id'] || task['assignee_ids'].includes(u_id)) {
    canEdit = true;
  }

  const [isOpenTaskDialog, setIsOpenTaskDialog] = useState(false);

  // open task dialog to edit a task
  const handleOpenTaskDialog = () => {
    setIsOpenTaskDialog(true);
  };
  // close the edit task dialog
  const handleCloseTaskDialog = () => {
    setIsOpenTaskDialog(false);
  };

  // format backend deadline to display on the frontend as "DD/MM/YY HH:MM am"
  const formatDeadline = (deadline) => {
    // backend deadline is "2022-11-24T11:58:00.000Z"
    if (deadline === '') {
      return deadline;
    }

    const timeNotFormated = new Date(deadline);
    const year = timeNotFormated.getFullYear();
    const month = (timeNotFormated.getMonth() + 1).toString().padStart(2, '0');
    const day = timeNotFormated.getDate().toString().padStart(2, '0');
    let hours = timeNotFormated.getHours();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = timeNotFormated.getMinutes().toString().padStart(2, '0');

    const localTime = `${day}/${month}/${year}  ${hours}:${minutes} ${ampm}`;
    return localTime;
  };

  return (
    <>
      <TableRow
        key={task['task_id']}
        hover={true}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row" onClick={handleOpenTaskDialog}>{task['title']}</TableCell>
        <TableCell align="center" onClick={handleOpenTaskDialog}>{task['task_id']}</TableCell>
        <TableCell align="left" onClick={handleOpenTaskDialog}>{task['description']}</TableCell>
        <TableCell align="center" onClick={handleOpenTaskDialog}>{formatDeadline(task['deadline'])}</TableCell>
        <TableCell align="center">
          <TaskStatusDropdown task={task} canEdit={canEdit} />
        </TableCell>
        <TableCell align="center">
          <TaskBoardPriorityStatus task={task} canEdit={canEdit} />
        </TableCell>
        <TableCell align="center" onClick={handleOpenTaskDialog}>{task['assignee_names'].join(', ')}</TableCell>
      </TableRow>
      <TaskDialog
        task={task}
        canEdit={canEdit}
        isOpen={isOpenTaskDialog}
        handleClose={handleCloseTaskDialog}
      />
    </>
  );
}

export default Task;

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
//     dependency_ids: [2, 3]
//   }
