import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import EditProfileDialog from './EditProfileDialog';

function ProfileButtons({ oldAvatar, weeklyWorkHours }) {
  const [isOpenProfileDialog, setIsOpenProfileDialog] = useState(false);

  // open edit profile dialog
  const handleOpenProfileDialog = () => {
    setIsOpenProfileDialog(true);
  };
  // close edit profile dialog
  const handleCloseProfileDialog = () => {
    setIsOpenProfileDialog(false);
  };

  return (
    <>
      <Stack direction="column" spacing={3}>
        <Button
          variant="outlined"
          color="primary"
          component={RouterLink}
          to="/taskboard?assigned=true"
        >
          MY TASKS
        </Button>
        <Button
          variant="outlined"
          color="primary"
          component={RouterLink}
          to="/connected-taskmasters"
        >
          MY FRIENDS
        </Button>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/self-reflection"
        >
          MY STATS
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleOpenProfileDialog}
        >
          EDIT
        </Button>
      </Stack>
      <EditProfileDialog
        oldAvatar={oldAvatar}
        weeklyWorkHours={weeklyWorkHours}
        isOpen={isOpenProfileDialog}
        handleClose={handleCloseProfileDialog}
      />
    </>
  );
}

export default ProfileButtons;
