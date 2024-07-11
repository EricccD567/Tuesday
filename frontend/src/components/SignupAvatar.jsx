import React, { useState, createRef } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import LargeAvatar from './LargeAvatar';
import SignupStepper from './SignupStepper';
import { fileToBase64 } from '../helper/FileHelper';
import { register } from '../helper/ApiHelper';

function SignupAvatar(props) {
  const { step, values } = props;

  // state variables that store the avatar in different forms
  const [avatar, setAvatar] = useState(null);
  const [avatarBase64, setAvatarBase64] = useState('');
  const inputFileRef = createRef(null);

  // removes the object url from the current window
  const cleanup = () => {
    URL.revokeObjectURL(avatar);
    inputFileRef.current.value = null;
  };

  // set the avatar to a new image
  const setImage = (newImage) => {
    if (avatar) {
      cleanup();
    }
    setAvatar(newImage);
  };

  // change the avatar
  const handleAvatarOnChange = (e) => {
    const newImage = e.target?.files?.[0];
    if (newImage) {
      setImage(URL.createObjectURL(newImage));
      fileToBase64(newImage).then((data) => setAvatarBase64(data));
    }
  };

  // remove the avatar
  const handleAvatarActions = (e) => {
    if (avatar) {
      e.preventDefault();
      setImage(null);
      setAvatarBase64('');
    }
  };

  // register the user and continue to the next step of the multipage signup form
  const cont = (values) => (e) => {
    e.preventDefault();
    register(values.firstName, values.lastName, +values.weeklyWorkHours, values.email, values.password, avatarBase64)
      .then((result) => {
        if (avatar) {
          cleanup();
        }
        localStorage.setItem('token', result['token']);
        localStorage.setItem('u_id', result['u_id']);
        props.nextStep();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // go back a step
  const back = (e) => {
    e.preventDefault();
    props.prevStep();
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h3"
        sx={{ mt: 4, mb: 2, fontWeight: 700 }}
      >
        Upload An Avatar
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 3, fontWeight: 400 }}
      >
        You can skip this step for now and upload an avatar from your profile later.
      </Typography>
      <LargeAvatar avatar={avatar} />
      <input
        id="upload-avatar"
        ref={inputFileRef}
        hidden
        type="file"
        accept="image/*"
        onChange={handleAvatarOnChange}
      />
      <label htmlFor="upload-avatar">
        <Button
          variant="contained"
          color="primary"
          component="span"
          onClick={handleAvatarActions}
          sx={{ mt: 2, mb: 3 }}
        >
          {avatar ? (
            <>
              <DeleteIcon sx={{ mr: 1 }} />
              Remove
            </>
          ) : (
            <>
              <CloudUploadIcon sx={{ mr: 1 }} />
              Upload
            </>
          )}
        </Button>
      </label>
      <SignupStepper step={step} />
      <Stack spacing={16} direction="row" sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={back}
          sx={{ width: 1, color: 'primary.main' }}
        >
          BACK
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={cont(values)}
          sx={{ width: 1, color: 'neutral.light' }}
        >
          FINISH
        </Button>
      </Stack>
    </Container>
  );
}

export default SignupAvatar;
