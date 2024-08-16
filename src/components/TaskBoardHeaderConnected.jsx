import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TaskBoardHeaderSortDropdown from './TaskBoardHeaderSortDropdown';
import { getAnyUserTasks, getAnyUserProfile } from '../helper/ApiHelper';

function TaskBoardHeaderConnected({ setAllTasks, urlUserId }) {
  const navigate = useNavigate();

  const currentUserToken = localStorage.getItem('token');

  const tasklistType = 'connected';

  // state variable that stores the name of the connected taskmaster
  const [userName, setUserName] = useState('Connected Taskmaster');

  // get the connected taskmasters name as well as their assigned tasks
  useEffect(() => {
    // get name and assigned tasks of a connected user, otherwise navigate to not found page
    toast.loading('Loading...', {
      id: 'loading',
    });
    getAnyUserProfile(currentUserToken, +urlUserId)
      .then((result) => {
        setUserName(result['first_name'] + ' ' + result['last_name']);
      })
      .then(() => {
        return getAnyUserTasks(currentUserToken, +urlUserId);
      })
      .then((result) => {
        setAllTasks(result);
        toast.success('Loaded!', {
          id: 'loaded',
        });
      })
      .catch((error) => {
        console.log(error.message);
        navigate('/404');
      });
    // eslint-disable-next-line
  }, []);

  // take user back to the previous page
  const handleBack = () => navigate(-1);

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
          whiteSpace: 'nowrap',
          display: { xs: 'none', md: 'block' },
        }}
      >
        {userName}'s Taskboard
      </Typography>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          columnGap: { xs: '5px', sm: '25px' },
        }}
      >
        <TaskBoardHeaderSortDropdown
          setAllTasks={setAllTasks}
          userId={urlUserId}
          tasklistType={tasklistType}
        />
        <Button onClick={handleBack} variant="outlined" color="primary">
          Back
        </Button>
      </Box>
    </Box>
  );
}

export default TaskBoardHeaderConnected;
