import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function ProfileButtonsConnected({ urlUserId }) {
  const navigate = useNavigate();

  // take the user back to the previous page
  const handleBack = () => navigate(-1);

  return (
    <Stack direction="column" spacing={3}>
      <Button
        variant="outlined"
        color="primary"
        component={RouterLink}
        // redirect to a connected user's taskboard 
        to={`/taskboard/${urlUserId}`}
      >
        TASKBOARD
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleBack}
      >
        BACK
      </Button>
    </Stack>
  );
}

export default ProfileButtonsConnected;
