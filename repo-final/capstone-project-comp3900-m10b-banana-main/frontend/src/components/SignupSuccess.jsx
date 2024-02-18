import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SignupStepper from './SignupStepper';

function SignupSuccess(props) {
  const { step } = props;

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
        sx={{
          mt: 4,
          mb: 2,
          fontWeight: 700,
          color: 'common.black',
        }}
      >
        Success!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 3,
          fontWeight: 400,
          color: 'common.black',
        }}
      >
        You have successfully signed up.
      </Typography>
      <SignupStepper step={step} />
      <Button
        variant="contained"
        color="primary"
        component={RouterLink}
        to="/taskboard"
        sx={{ color: 'neutral.light' }}
      >
        VIEW YOUR TASKBOARD
      </Button>
    </Container>
  );
}

export default SignupSuccess;
