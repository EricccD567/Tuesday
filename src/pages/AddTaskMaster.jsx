import styles from '../App.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { sendConnectionRequest } from '../helper/ApiHelper';

function AddTaskMaster(props) {
  const navigate = useNavigate();

  const { redirectUnauthorized } = props;

  // go back to the previous page
  const goBack = () => {
    toast.remove();
    navigate(-1);
  };

  useEffect(() => {
    // redirect user to login page if they are not logged in
    if (redirectUnauthorized()) {
      navigate('/login');
      return;
    }
    // eslint-disable-next-line
  }, []);

  const [connectionEmail, setConnectionEmail] = useState('');

  // call backend to send a connection request from the user to the other person's email
  const sendRequest = () => {
    sendConnectionRequest(localStorage.getItem('token'), connectionEmail)
      .then(() => {
        toast.success('Your connection request has been sent!', {
          id: 'sendConnectionRequestSuccess',
        });
        setConnectionEmail('');
      })
      .catch((error) => {
        console.log(error.message);
        setConnectionEmail('');
      });
  };

  return (
    <div className={styles.pageContainer}>
      <IconButton onClick={goBack}>
        <ArrowBackIcon />
      </IconButton>

      <Stack alignItems="center" sx={{ mt: 2 }}>
        <Typography variant="h5">
          Enter the email of the task master you want to connect to:
        </Typography>
        <TextField
          variant="outlined"
          sx={{ width: '50%', mt: 4, mb: 10 }}
          value={connectionEmail}
          onChange={(event) => setConnectionEmail(event.target.value)}
        />
        <Button variant="contained" onClick={sendRequest}>
          Send Connection Request
        </Button>
      </Stack>
    </div>
  );
}

export default AddTaskMaster;
