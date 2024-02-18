import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function Landing() {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="h1"
        sx={{
          mt: 16,
          mb: 8,
          fontWeight: 700,
          color: 'secondary.main',
        }}
      >
        Welcome To Tuesday!
      </Typography>
      <Button
        variant="contained"
        size="large"
        color="secondary"
        component={RouterLink}
        to="/signup"
        sx={{ color: 'neutral.main' }}
      >
        GET STARTED
      </Button>
    </Box>
  );
}

export default Landing;
