import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  acceptConnectionRequest,
  getConnectionRequests,
} from '../helper/ApiHelper';

function ConnectionRequest({ user, setConnectionRequests }) {
  // send accept request to backend when 'Accept Request' button is clicked
  const acceptClicked = () => {
    acceptConnectionRequest(localStorage.getItem('token'), user.user_id)
      // make request disappear when accept is clicked
      .then(() => {
        return getConnectionRequests(localStorage.getItem('token'));
      })
      .then((result) => {
        // show connection requests again but without the user we just accepted
        setConnectionRequests(result);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row">
        <Stack direction="row" justifyContent="space-between">
          <Typography>{`${user.first_name} ${user.last_name}`}</Typography>
          <Button variant="contained" onClick={acceptClicked}>
            Accept Request
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

export default ConnectionRequest;

// user = {
//   user_id: 4,
//   first_name: "Barny",
//   last_name: "Jr",
// }
