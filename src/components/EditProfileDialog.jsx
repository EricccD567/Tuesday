import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import LargeAvatar from './LargeAvatar';
import { fileToBase64 } from '../helper/FileHelper';
import { editProfile } from '../helper/ApiHelper';

function EditProfileDialog(props) {
  const { oldAvatar, weeklyWorkHours, isOpen, handleClose } = props;

  // state variables that stores the edited avatar and weekly working hours
  const [avatarBase64, setAvatarBase64] = useState(oldAvatar);
  const [newWeeklyWorkHours, setNewWeeklyWorkHours] = useState(weeklyWorkHours);

  // update the above state variables to the default variables passed in from the props
  useEffect(() => {
    setAvatarBase64(oldAvatar)
    setNewWeeklyWorkHours(weeklyWorkHours)
  }, [oldAvatar, weeklyWorkHours]);

  // sets to true if user makes an edit
  const [edited, setEdited] = useState(false);

  // remove the current avatar
  const handleRemoveAvatar = () => {
    setAvatarBase64('');
    setEdited(true);
  };

  // add a new avatar
  const handleAvatarOnChange = (e) => {
    const newImage = e.target?.files?.[0];
    if (newImage) {
      fileToBase64(newImage).then((data) => setAvatarBase64(data));
      setEdited(true);
    }
  };

  // change weekly working hours
  const handleWeeklyWorkHoursOnChange = (e) => {
    setNewWeeklyWorkHours(e.target.value);
    setEdited(true);
  };

  // close the dialog and reset everything to default
  const handleOnClose = () => {
    setAvatarBase64(oldAvatar);
    setNewWeeklyWorkHours(weeklyWorkHours);
    setEdited(false);
    handleClose();
  };

  // save any changes made
  const handleEditProfile = (e) => {
    e.preventDefault();
    editProfile(localStorage.getItem('token'), +newWeeklyWorkHours, avatarBase64)
      .then(() => {
        setEdited(false);
        handleClose();
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleOnClose}
      maxWidth="sm"
      fullWidth={true}
      aria-labelledby="edit-profile-dialog-title"
      aria-describedby="edit-profile-dialog-details"
    >
      <DialogTitle
        id="edit-profile-dialog-title"
        sx={{ fontSize: 22, fontWeight: '500' }}
      >
        Edit Profile
      </DialogTitle>
      <DialogContent
        id="edit-profile-dialog-details"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <LargeAvatar avatar={avatarBase64} />
        <Stack direction="row" spacing={4} sx={{ mt: 2, mb: 3 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleRemoveAvatar}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            Remove
          </Button>
          <Button
            variant="contained"
            color="primary"
            component="label"
            htmlFor="upload-avatar"
          >
            <CloudUploadIcon sx={{ mr: 1 }} />
            Upload
            <input
              id="upload-avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarOnChange}
              hidden
            />
          </Button>
        </Stack>
        <TextField
          margin="normal"
          required
          type="number"
          defaultValue={weeklyWorkHours}
          label="Maximum Weekly Working Hours"
          onChange={handleWeeklyWorkHoursOnChange}
        />
      </DialogContent>
      <DialogActions sx={{ mb: 2, mr: 2 }}>
        <Button
          onClick={handleOnClose}
          variant="outlined"
          color="primary"
        >
          Cancel
        </Button>
        <Button
          disabled={!edited}
          onClick={handleEditProfile}
          autoFocus
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditProfileDialog;
