import React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

// label for each step in the signup process
const stepLabels = ['Details', 'Avatar', 'Finish'];

function SignupStepper(props) {
  const { step } = props;

  return (
    <Box sx={{ width: '100%', my: 4 }}>
      <Stepper activeStep={step - 1} alternativeLabel>
        {stepLabels.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}

export default SignupStepper;
