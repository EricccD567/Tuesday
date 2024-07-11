import React, { useState, useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { getConnectedUsers } from '../helper/ApiHelper';

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

function SelectAssigneeDropdown({ selectedAssigneeIds, setSelectedAssigneeIds }) {
  const [users, setUsers] = useState([]);

  // on load, get dropdown options from backend (user + their connected task masters)
  useEffect(() => {
    getConnectedUsers(localStorage.getItem('token'))
      .then((result) => {
        setUsers(result);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  // convert a user id to their full name
  const idToName = (id) => {
    const user = users.filter((user) => user['user_id'] === id)[0];
    return user['first_name'] + ' ' + user['last_name'];
  };

  // update the selected assignees
  const handleChange = (event) => {
    // event.target.value is a list of user ids [5, 4] selected to be assigned to a task
    const {
      target: { value },
    } = event;
    setSelectedAssigneeIds(value);
  };

  return (
    <div>
      <FormControl sx={{ mt: 2, width: { xs: 450, md: '100%' } }} >
        <InputLabel id="users-checkbox-dropdown-menu">Assign To</InputLabel>
        <Select
          labelId="users-checkbox-dropdown-menu"
          multiple
          value={selectedAssigneeIds}
          onChange={handleChange}
          input={<OutlinedInput label="Assignee" />}
          renderValue={users.length === 0 ? () => { } : (selected) => selected.map(id => idToName(id)).join(', ')}
          MenuProps={MenuProps}
        >
          {users.map((user, index) => (
            // for the list of users obtained from the backend, make each user an option in the dropdown
            <MenuItem key={index} value={user['user_id']}>
              <Checkbox
                checked={selectedAssigneeIds.indexOf(user['user_id']) > -1}
              />
              <ListItemText
                primary={user['first_name'] + ' ' + user['last_name']}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default SelectAssigneeDropdown;

// users data structure:
//  [
//     {
//         userId: 5,
//         firstName: "Brenda",
//         lastName: "Wu",
//     },
//     {
//         userId: 3,
//         firstName: "Tom",
//         lastName: "Cruise",
//     }
//   ]
