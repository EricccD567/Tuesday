import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { logout } from '../helper/ApiHelper';

function LogoutConfirmDialog(props) {
  const navigate = useNavigate();

  const { isOpen, handleClose } = props;

  // send a request to backend to log out the user
  const handleLogout = (e) => {
    e.preventDefault();
    logout(localStorage.getItem('token'))
      .then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('u_id');
        navigate('/');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="logout-confirmation-dialog-title"
      aria-describedby="logout-confirmation-dialog-description"
    >
      <DialogTitle id="logout-confirmation-dialog-title">Log Out</DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-confirmation-dialog-description">
          Are you sure you want to log out of Tuesday?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ mb: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="primary"
          size="small"
        >
          Go Back
        </Button>
        <Button
          onClick={handleLogout}
          autoFocus
          variant="contained"
          color="primary"
          size="small"
          sx={{ mr: 2 }}
        >
          Log Out
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LogoutConfirmDialog;
