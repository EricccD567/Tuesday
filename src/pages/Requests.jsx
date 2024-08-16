import styles from '../App.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ConnectionRequest } from '../components';
import { getConnectionRequests } from '../helper/ApiHelper';

function Requests(props) {
  const navigate = useNavigate();

  const { redirectUnauthorized } = props;

  // take user back to previous page
  const goBack = () => navigate(-1);

  const [connectionRequests, setConnectionRequests] = useState([]);

  useEffect(() => {
    // redirect user to login page if they are not logged in
    if (redirectUnauthorized()) {
      navigate('/login');
      return;
    }

    // on load, populate the user's pending connection requests in the table
    getConnectionRequests(localStorage.getItem('token'))
      .then((result) => {
        setConnectionRequests(result);
      })
      .catch((error) => {
        console.log(error.message);
      });
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.pageContainer}>
      <IconButton onClick={goBack}>
        <ArrowBackIcon />
      </IconButton>
      <Stack alignItems="center" sx={{ mt: 0, mx: 20 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            {/* table heading */}
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Typography variant="h6">Your Connection Requests</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            {/* table body */}
            <TableBody>
              {connectionRequests.map((user, index) => (
                // make a component for each connection request
                <ConnectionRequest
                  key={index}
                  user={user}
                  setConnectionRequests={setConnectionRequests}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </div>
  );
}

export default Requests;

// connectionRequests = [
//   {
//     user_id: 4,
//     first_name: "Barny",
//     last_name: "Jr",
//   },
//   {
//     user_id: 5,
//     first_name: "Simon",
//     last_name: "Says",
//   },
//   {
//     user_id: 6,
//     first_name: "Freya",
//     last_name: "P",
//   }
// ]
