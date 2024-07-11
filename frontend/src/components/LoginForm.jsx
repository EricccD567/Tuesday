import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { login } from '../helper/ApiHelper';

function LoginForm(props) {
  const navigate = useNavigate();

  const { emailRef, passwordRef } = props;

  const [passwordVisibility, setPasswordVisibility] = useState(false);

  // change password visibility
  const handleClickShowPassword = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  // checks all text fields are not empty
  const textFieldsCheck = () => {
    for (const [fieldNameRef, valueRef] of Object.entries(props)) {
      if (!valueRef.current.value.trim()) {
        const fieldName = fieldNameRef
          .match(/([A-Z]?[^A-Z]*)/g)
          .slice(0, -2)
          .join(' ')
          .toLowerCase();
        toast.error(`Please fill in the ${fieldName} field!`, {
          id: 'errorLoginEmptyFields',
        });
        return false;
      }
    }
    return true;
  };

  // sends a fetch call to backend to check login details and login user
  const handleLogin = (e) => {
    e.preventDefault();
    if (!textFieldsCheck()) {
      return;
    }
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    login(email, password)
      .then((result) => {
        toast.remove();
        localStorage.setItem('token', result['token']);
        localStorage.setItem('u_id', result['u_id']);
        navigate('/taskboard');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <Container
      component="form"
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
        Log In
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 1,
          fontWeight: 400,
          color: 'common.black',
        }}
      >
        Enter your details below to log in.
      </Typography>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Email"
        inputRef={emailRef}
      />
      <FormControl variant="outlined" margin="normal" required fullWidth>
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={passwordVisibility ? 'text' : 'password'}
          inputRef={passwordRef}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {passwordVisibility ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>
      <Stack spacing={16} direction="row" sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          component={RouterLink}
          to="/"
          sx={{ width: 1, color: 'primary.main' }}
        >
          CANCEL
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={handleLogin}
          sx={{ width: 1, color: 'neutral.light' }}
        >
          LOG IN
        </Button>
      </Stack>
    </Container>
  );
}

export default LoginForm;
