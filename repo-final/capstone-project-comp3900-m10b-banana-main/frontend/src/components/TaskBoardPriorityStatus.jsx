import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { updateTaskPriority } from '../helper/ApiHelper';

function TaskBoardPriorityStatus({ task, canEdit }) {
  const [priorityStatus, setPriorityStatus] = useState(task['priority']);

  // update priority status in the backend
  const priorityUpdated = (event) => {
    setPriorityStatus(event.target.value);
    updateTaskPriority(event.target.value, task['task_id'], localStorage.getItem('token'))
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <Select
      onChange={priorityUpdated}
      value={priorityStatus}
      disabled={!canEdit}
      sx={{ width: 125, height: 50, fontSize: 14 }}
    >
      <MenuItem value={"Low"} dense={true}>Low</MenuItem>
      <MenuItem value={"Medium"} dense={true}>Medium</MenuItem>
      <MenuItem value={"High"} dense={true}>High</MenuItem>
    </Select>
  );
}

export default TaskBoardPriorityStatus;
