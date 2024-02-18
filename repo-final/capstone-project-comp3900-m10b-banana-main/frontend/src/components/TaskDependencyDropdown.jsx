import React, { useState, useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { getAllTasks } from '../helper/ApiHelper';

const ITEM_HEIGHT = 60;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function TaskDependencyDropdown({ taskDependencies, setTaskDependencies }) {
  const [allTasks, setAllTasks] = useState([]);

  // on load, get all tasks
  useEffect(() => {
    getAllTasks(localStorage.getItem('token'))
      .then((result) => {
        setAllTasks(result);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  // update task dependencies when user changes their selection in the dropdown
  const handleChange = (event) => {
    // event.target.value is a list of task ids [5, 4] that the user has selected as dependencies
    setTaskDependencies(event.target.value);
  };

  // convert a task's id to its title
  const idToTitle = (id) => {
    const task = allTasks.filter((task) => task['task_id'] === id)[0];
    return task['title'];
  };

  return (
    <FormControl sx={{ mt: 2, width: { xs: 450, md: '100%' } }} >
      <InputLabel id="task-dependencies-dropdown">Task Dependencies</InputLabel>
      <Select
        labelId="task-dependencies-dropdown"
        multiple
        value={taskDependencies}
        onChange={handleChange}
        input={<OutlinedInput label="Task Dependency" />}
        renderValue={allTasks.length === 0 ? () => { } : (selected) => selected.map(id => idToTitle(id)).join(', ')}
        MenuProps={MenuProps}
      >
        {allTasks.map((task, index) => (
          // create a dropdown option for each task
          <MenuItem key={index} value={task['task_id']}>
            <Checkbox
              checked={taskDependencies.indexOf(task['task_id']) > -1}
            />
            <ListItemText
              primary={task['title']}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default TaskDependencyDropdown;
