import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { removeConnection, getConnectedTaskMasters } from '../helper/ApiHelper';

function RemoveConnectedUserDialog({ isOpen, setIsOpen, user, setConnectedTaskMasters }) {
  // remove a connection from the user's list of connected task masters
  const handleRemoveConnection = (e) => {
    // call backend to remove the connection
    removeConnection(localStorage.getItem('token'), user['user_id'])
      .then(() => {
        // close the dialog after 'Yes' has been clicked
        setIsOpen(false);
        return getConnectedTaskMasters(localStorage.getItem('token'));
      })
      .then(result => {
        // refresh the list of connected task masters after the connection has been removed
        setConnectedTaskMasters(result);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="remove-connection-confirmation-dialog-title"
      aria-describedby="remove-connection-confirmation-dialog-description"
    >
      <DialogTitle id="remove-connection-confirmation-dialog-title">
        Remove Connection
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="remove-connection-confirmation-dialog-description">
          Are you sure you want to remove {user['first_name']} {user['last_name']} from your connected task masters?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ mb: 2 }}>
        <Button
          onClick={() => setIsOpen(false)}
          variant="outlined"
          color="primary"
          size="small"
        >
          No
        </Button>
        <Button
          onClick={handleRemoveConnection}
          autoFocus
          variant="contained"
          color="primary"
          size="small"
          sx={{ mr: 2 }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RemoveConnectedUserDialog;
