import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import {
  SignedOutHeader,
  SignedInHeader,
  SignupDetails,
  SignupAvatar,
  SignupSuccess,
} from '../components';

function Signup() {
  // state variable to store the step the user is currently in for the signup multistep form
  const [step, setStep] = useState(1);

  // state variable to store the details entered by the user
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    weeklyWorkHours: 1,
    email: '',
    password: '',
    confirmPassword: '',
  });

  // go to next step
  const nextStep = () => {
    setStep((prev) => {
      return prev + 1;
    });
  };

  // go to previous step
  const prevStep = () => {
    setStep((prev) => {
      return prev - 1;
    });
  };

  // handle field changes
  const handleChange = (input) => (e) => {
    setState({ ...state, [input]: e.target.value });
  };

  // extract stored details of state and assign to values to pass in as props
  const {
    firstName,
    lastName,
    weeklyWorkHours,
    email,
    password,
    confirmPassword,
  } = state;
  const values = {
    firstName,
    lastName,
    weeklyWorkHours,
    email,
    password,
    confirmPassword,
  };

  switch (step) {
    case 1:
      return (
        <>
          <SignedOutHeader />
          <SignupDetails
            step={step}
            nextStep={nextStep}
            handleChange={handleChange}
            values={values}
          />
        </>
      );
    case 2:
      return (
        <>
          <SignedOutHeader />
          <SignupAvatar
            step={step}
            nextStep={nextStep}
            prevStep={prevStep}
            values={values}
          />
        </>
      );
    case 3:
      return (
        <>
          <SignedInHeader />
          <SignupSuccess step={step} />
        </>
      );
    default:
      return (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Signup form step out-of-bounds.
        </Alert>
      );
  }
}

export default Signup;
