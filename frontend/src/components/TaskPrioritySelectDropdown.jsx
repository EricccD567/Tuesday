import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function TaskPrioritySelectDropdown({ priority, setPriority, fromTaskboard, canEdit }) {
  let formStyle = { width: 125 }
  let selectStyle = { height: 50 }
  // change style if component is not on the taskboard
  if (!fromTaskboard) {
    formStyle = { width: 125, mt: 2, ml: 2 }
    selectStyle = {}
  }
  return (
    <FormControl
      required
      sx={formStyle}
    >
      {!fromTaskboard &&
        <InputLabel id="priority-label">Priority</InputLabel>
      }
      <Select
        labelId="priority-label"
        value={priority}
        label={fromTaskboard ? "" : "Priority"}
        onChange={e => setPriority(e.target.value)}
        disabled={!canEdit}
        sx={selectStyle}

      >
        <MenuItem value={"Low"}>Low</MenuItem>
        <MenuItem value={"Medium"}>Medium</MenuItem>
        <MenuItem value={"High"}>High</MenuItem>
      </Select>
    </FormControl>
  );
}

export default TaskPrioritySelectDropdown;
