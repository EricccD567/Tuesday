import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { updateTaskStatus } from '../helper/ApiHelper';

function TaskStatusDropdown({ task, canEdit }) {
  const [taskStatus, setTaskStatus] = useState(task['status']);

  // update a task's status when the user clicks on a status option from the dropdown on the frontend
  const statusUpdated = (event) => {
    setTaskStatus(event.target.value);
    updateTaskStatus(event.target.value, task['task_id'], localStorage.getItem('token'))
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <Select
      onChange={statusUpdated}
      value={taskStatus}
      disabled={!canEdit}
      sx={{ width: 125, height: 50, fontSize: 14 }}
    >
      <MenuItem value={'Not Started'} dense={true}>Not Started</MenuItem>
      <MenuItem value={'In Progress'} dense={true}>In Progress</MenuItem>
      <MenuItem value={'Completed'} dense={true}>Completed</MenuItem>
      <MenuItem value={'Blocked'} dense={true}>Blocked</MenuItem>
    </Select>
  )
}

export default TaskStatusDropdown;
