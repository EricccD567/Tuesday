import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
import SignupStepper from './SignupStepper';
import { registerCheck } from '../helper/ApiHelper';

function SignupDetails(props) {
  const { step, values, handleChange } = props;

  // visibility state of password and confirm password
  const [passwordsVisibility, setPasswordsVisibility] = useState({
    showPassword: false,
    showConfirmPassword: false,
  });

  // set the password visibility to its inverse
  const handleClickShowPassword = () => {
    setPasswordsVisibility({
      ...passwordsVisibility,
      showPassword: !passwordsVisibility.showPassword,
    });
  };

  // set the confirm password visibility to its inverse
  const handleClickShowConfirmPassword = () => {
    setPasswordsVisibility({
      ...passwordsVisibility,
      showConfirmPassword: !passwordsVisibility.showConfirmPassword,
    });
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  // check all registration details are valid (no empty fields and passwords match)
  const textFieldsCheck = (values) => {
    for (const [field, value] of Object.entries(values)) {
      if (typeof value === 'string' && !value.trim()) {
        const fieldName = field
          .match(/([A-Z]?[^A-Z]*)/g)
          .slice(0, -1)
          .join(' ')
          .toLowerCase();
        toast.error(`Please fill in the ${fieldName} field!`, {
          id: 'errorSignupEmptyFields',
        });
        return false;
      }
    }
    if (values.password !== values.confirmPassword) {
      toast.error('Password must match confirm password!', {
        id: 'errorSignupMismatchPasswords',
      });
      return false;
    }
    return true;
  };

  // check registration details via the backend and continue to the next step in multistep signup form
  const cont = (values) => (e) => {
    e.preventDefault();
    if (!textFieldsCheck(values)) {
      return;
    }
    registerCheck(values.firstName, values.lastName, +values.weeklyWorkHours, values.email, values.password)
      .then(() => {
        toast.remove();
        props.nextStep();
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
        sx={{ mt: 4, mb: 2, fontWeight: 700 }}
      >
        Sign Up
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 3, fontWeight: 400 }}
      >
        Please fill in your details below.
      </Typography>
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ width: 1, mb: 1 }}
      >
        <TextField
          variant="outlined"
          required
          fullWidth
          label="First Name"
          onChange={handleChange('firstName')}
          defaultValue={values.firstName}
        />
        <TextField
          variant="outlined"
          required
          fullWidth
          label="Last Name"
          onChange={handleChange('lastName')}
          defaultValue={values.lastName}
        />
      </Stack>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        type="number"
        label="Maximum Weekly Working Hours"
        onChange={handleChange('weeklyWorkHours')}
        defaultValue={values.weeklyWorkHours}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Email"
        onChange={handleChange('email')}
        defaultValue={values.email}
      />
      <FormControl variant="outlined" margin="normal" required fullWidth>
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={passwordsVisibility.showPassword ? 'text' : 'password'}
          onChange={handleChange('password')}
          defaultValue={values.password}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {passwordsVisibility.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>
      <FormControl variant="outlined" margin="normal" required fullWidth>
        <InputLabel htmlFor="outlined-adornment-confirm-password">
          Confirm Password
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-confirm-password"
          type={passwordsVisibility.showConfirmPassword ? 'text' : 'password'}
          onChange={handleChange('confirmPassword')}
          defaultValue={values.confirmPassword}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle confirm password visibility"
                onClick={handleClickShowConfirmPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {passwordsVisibility.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Confirm Password"
        />
      </FormControl>
      <SignupStepper step={step} />
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
          onClick={cont(values)}
          sx={{ width: 1, color: 'neutral.light' }}
        >
          NEXT
        </Button>
      </Stack>
    </Container>
  );
}

export default SignupDetails;
