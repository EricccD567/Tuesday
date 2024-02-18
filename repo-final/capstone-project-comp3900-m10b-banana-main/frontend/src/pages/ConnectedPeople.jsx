import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import { ConnectedTaskMasterRow } from '../components';
import { getConnectedTaskMasters, getConnectionRequests } from '../helper/ApiHelper';

function ConnectedPeople(props) {
  const navigate = useNavigate();

  const { redirectUnauthorized } = props;

  const [connectedTaskMasters, setConnectedTaskMasters] = useState([]);
  const [numConnectionRequests, setNumConnectionRequests] = useState(0);

  useEffect(() => {
    // redirect user to login page if they are not logged in
    if (redirectUnauthorized()) {
      navigate('/login');
      return;
    }
    // on load, populate the list of connected task masters and the number of pending connection requests
    getConnectedTaskMasters(localStorage.getItem('token'))
      .then((result) => {
        setConnectedTaskMasters(result);
      })
      .then(() => {
        return getConnectionRequests(localStorage.getItem('token'));
      })
      .then((result) => {
        setNumConnectionRequests(result.length);
      })
      .catch((error) => {
        console.log(error.message);
      });
    // eslint-disable-next-line
  }, []);

  // take user to the Add Taskmaster page when they click on the Add Taskmasters button
  const addTaskMaster = () => {
    navigate('/add-taskmaster');
  };

  // take user to the Connection Requests page when they click on the View Requests button
  const viewRequests = () => {
    navigate('/connection-requests');
  };

  return (
    <div style={{ margin: '70px 180px' }}>
      <Stack
        direction="row"
        spacing={3}
        justifyContent="flex-end"
        sx={{ mb: 6 }}
      >
        <Badge badgeContent={numConnectionRequests} color="primary">
          <Button variant="outlined" onClick={viewRequests}>
            View Requests
          </Button>
        </Badge>
        <Button variant="outlined" onClick={addTaskMaster}>
          Add Task Masters
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          {/* table headings */}
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography variant="h6">
                  Your Connected Task Masters
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          {/* table body */}
          <TableBody>
            {connectedTaskMasters.map((user, index) => (
              // make a component for each connected task master
              <ConnectedTaskMasterRow
                key={index}
                user={user}
                setConnectedTaskMasters={setConnectedTaskMasters}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ConnectedPeople;

// connectedTaskMasters = [
//   {
//     user_id: 1,
//     first_name: "Tim",
//     last_name: "Cook",
//   },
//   {
//     user_id: 2,
//     first_name: "Emily",
//     last_name: "So",
//   },
//   {
//     user_id: 3,
//     first_name: "Bella",
//     last_name: "Hadid",
//   }
// ]
