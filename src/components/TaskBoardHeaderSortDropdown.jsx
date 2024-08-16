import React, { useState } from 'react';
import toast from 'react-hot-toast';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { getSortedTasks } from '../helper/ApiHelper';

function TaskBoardHeaderSortDropdown({ setAllTasks, userId, tasklistType }) {
  // anchorEl controls the dropdown menu when the sort icon is clicked
  const [anchorEl, setAnchorEl] = useState(null);

  // sort icon is clicked, open dropdown menu
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  // close the dropdown menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // call backend to sort the tasks based on the sort type user has picked
  const sortTasks = (sortType) => {
    toast.loading('Loading...', {
      id: 'loading',
    });
    // sortType = 'creation': sort tasks based on creation datetime using the backend
    // sortType = 'deadline': sort tasks based on deadline datetime using the backend
    // sortType = 'priority': sort tasks based on priority algorithm using the backend
    getSortedTasks(localStorage.getItem('token'), +userId, tasklistType, sortType)
      .then((result) => {
        setAllTasks(result);
        toast.success('Loaded!', {
          id: 'loaded',
        });
      })
      .catch((error) => {
        console.log(error.message);
      });

    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleMenu}>
        <FilterListIcon color="primary" fontSize="large" />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {/* sort types/options */}
        <MenuItem onClick={() => sortTasks('creation')}>Creation</MenuItem>
        <MenuItem onClick={() => sortTasks('deadline')}>Deadline</MenuItem>
        <MenuItem onClick={() => sortTasks('priority')}>Personalised Priority</MenuItem>
      </Menu>
    </>
  );
}

export default TaskBoardHeaderSortDropdown;
