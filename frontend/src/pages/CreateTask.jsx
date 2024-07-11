import styles from '../App.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { SelectAssigneeDropdown, TaskPrioritySelectDropdown, TaskDependencyDropdown } from '../components';
import { createTask } from '../helper/ApiHelper';

function CreateTask(props) {
  const navigate = useNavigate();

  const { redirectUnauthorized } = props;

  // state variables to store user inputted task details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [hoursToComplete, setHoursToComplete] = useState(0);
  const [priority, setPriority] = useState('')
  const [taskDependencies, setTaskDependencies] = useState([])

  useEffect(() => {
    // redirect user to login page if they are not logged in
    if (redirectUnauthorized()) {
      navigate('/login');
      return;
    }
    // eslint-disable-next-line
  }, []);

  // send user input to backend when the Create Task button is clicked
  const submitHandler = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    // format deadline to ISO 8601 format
    // e.g. if deadline is "2017-05-24T10:30"
    // then utcDeadline = "2017-05-24T00:30:00.000Z"
    const utcDeadline = deadline ? new Date(deadline).toISOString() : deadline;
    // call backend
    createTask(title, description, selectedAssigneeIds, utcDeadline, hoursToComplete, priority, taskDependencies, token)
      .then(() => {
        navigate('/taskboard');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // take user back to the previous page
  const cancelButtonClicked = () => {
    navigate(-1);
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Create A New Task</h1>
      <form onSubmit={submitHandler}>
        <TextField
          fullWidth
          required
          label="Title"
          onChange={(e) => setTitle(e.target.value)}
          style={{ margin: 0, marginBottom: '20px' }}
        />
        <TextField
          fullWidth
          required
          label="Description"
          multiline={true}
          rows={6}
          onChange={(e) => setDescription(e.target.value)}
          style={{ margin: 0 }}
        />
        <SelectAssigneeDropdown
          selectedAssigneeIds={selectedAssigneeIds}
          setSelectedAssigneeIds={setSelectedAssigneeIds}
        />
        <TextField
          label="Deadline"
          type="datetime-local"
          sx={{ width: 300, mt: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
          // event.target.value is in the format "2017-05-24T10:30"
          onChange={(e) => setDeadline(e.target.value)}
        />
        <TextField
          required
          label="Estimated Hours To Complete"
          type="number"
          onChange={(e) => setHoursToComplete(e.target.value)}
          style={{ marginLeft: '20px' }}
          sx={{ mt: 2, width: 290 }}
        />
        <TaskPrioritySelectDropdown
          priority={priority}
          setPriority={setPriority}
          fromTaskboard={false}
          canEdit={true}
        />
        <Box
          sx={{ display: 'flex', width: '100%' }}>
          <TaskDependencyDropdown
            taskDependencies={taskDependencies}
            setTaskDependencies={setTaskDependencies}
          />
          <Tooltip title="This task cannot be started until its task dependencies are completed." placement="top-start">
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box display="flex" justifyContent="flex-end" sx={{ mt: 5 }}>
          <Button
            variant="outlined"
            onClick={cancelButtonClicked}
            sx={{ mx: 3 }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </Box>
      </form>
    </div>
  );
}

export default CreateTask;
