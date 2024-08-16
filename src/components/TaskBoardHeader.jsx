import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TaskBoardHeaderSortDropdown from './TaskBoardHeaderSortDropdown';
import {
  getAssignedTasks,
  getAllTasks,
  searchTasks,
} from '../helper/ApiHelper';

function TaskBoardHeader({ setAllTasks, isAssigned }) {
  const navigate = useNavigate();

  const currentUserToken = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('u_id');

  // variables for the 'My Tasks' toggle
  const initialToggleState = isAssigned === 'true' ? true : false;
  const [isToggled, setIsToggled] = useState(initialToggleState);
  const tasklistType = isToggled ? 'assigned' : 'all';

  // update the tasks user can see when the 'My Tasks' toggle is changed
  useEffect(() => {
    toast.loading('Loading...', {
      id: 'loading',
    });
    if (isToggled) {
      // get assigned tasks of the current user
      getAssignedTasks(currentUserToken)
        .then((result) => {
          setAllTasks(result);
          toast.success('Loaded!', {
            id: 'loaded',
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      // get all tasks (includes their connected task masters' tasks)
      getAllTasks(currentUserToken)
        .then((result) => {
          setAllTasks(result);
          toast.success('Loaded!', {
            id: 'loaded',
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
    // eslint-disable-next-line
  }, [isToggled]);

  // toggle is changed
  const changeToggle = (e) => {
    setIsToggled(!isToggled);
  };

  // take user to the Create Task page
  const createTask = () => {
    navigate('/create-task');
  };

  // send a request to the backend to search through tasks with the given query
  const searchClicked = (event) => {
    event.preventDefault();
    const query = event.target.searchQuery.value;
    toast.loading('Loading...', {
      id: 'loading',
    });
    searchTasks(query, currentUserToken, tasklistType)
      .then((result) => {
        setAllTasks(result);
        toast.success('Loaded!', {
          id: 'loaded',
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <Box
      sx={{
        m: { xs: '20px 20px 10px 20px', md: '60px 80px 40px 80px' },
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        columnGap: { xs: '0px', sm: '20px', md: '40px' },
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          color: 'common.black',
          display: { xs: 'none', md: 'block' },
        }}
      >
        Taskboard
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={<Switch onChange={(e) => changeToggle(e)} />}
          label="My Tasks"
          checked={isToggled}
        />
      </FormGroup>
      <IconButton onClick={createTask}>
        <AddCircleOutlineIcon color="primary" fontSize="large" />
      </IconButton>
      <Box
        sx={{
          width: '100%',
          whiteSpace: 'nowrap',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          columnGap: { xs: '5px', sm: '25px' },
        }}
      >
        <TaskBoardHeaderSortDropdown
          setAllTasks={setAllTasks}
          userId={currentUserId}
          tasklistType={tasklistType}
        />
        <form onSubmit={(event) => searchClicked(event)}>
          <TextField
            className="text"
            name="searchQuery"
            label="Search..."
            variant="outlined"
            size="small"
          />
          <IconButton type="submit" aria-label="search">
            <SearchIcon sx={{ fill: 'gray' }} />
          </IconButton>
        </form>
      </Box>
    </Box>
  );
}

export default TaskBoardHeader;
