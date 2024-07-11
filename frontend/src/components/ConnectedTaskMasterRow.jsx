import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveConnectedUserDialog from './RemoveConnectedUserDialog';

function ConnectedTaskMasterRow ({ user, setConnectedTaskMasters }) {
  const navigate = useNavigate();

  const [isOpenUnconnectDialog, setIsOpenUnconnectDialog] = useState(false);

  // open dialog to confirm if user wants to remove a connection from their connected users list
  const deleteConnectionClicked = () => {
    setIsOpenUnconnectDialog(true);
  };

  // view the profile for one of their connected task masters
  const viewProileClicked = () => {
    navigate(`/profile/${user['user_id']}`);
  };

  return (
    <>
      {/* connected task master row */}
      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell component="th" scope="row">
          <Stack direction="row" justifyContent="space-between">
            <Typography>
              {`${user['first_name']} ${user['last_name']}`}
            </Typography>
            <Stack direction="row" spacing={2}>
              <IconButton onClick={deleteConnectionClicked}>
                <DeleteOutlineIcon sx={{ color: 'status.red' }} />
              </IconButton>
              <Button variant="outlined" onClick={viewProileClicked}>
                View Profile
              </Button>
            </Stack>
          </Stack>
        </TableCell>
      </TableRow>

      {/* remove connected user confirmation dialog */}
      <RemoveConnectedUserDialog
        isOpen={isOpenUnconnectDialog}
        setIsOpen={setIsOpenUnconnectDialog}
        user={user}
        setConnectedTaskMasters={setConnectedTaskMasters}
      />
    </>
  );
}

export default ConnectedTaskMasterRow;

// user = {
//   user_id: 4,
//   first_name: "Barny",
//   last_name: "Jr",
// }
