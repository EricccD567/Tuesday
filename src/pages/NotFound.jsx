import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function NotFound() {
  const navigate = useNavigate();

  // take user back to the previous working page
  const handleBack = () => navigate(-2);

  return (
    <>
      <Box
        sx={{ width: 1, height: 64, bgcolor: 'primary.main', boxShadow: 4 }}
      ></Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            mt: 4,
            mb: 2,
            fontWeight: 700,
            color: 'common.black',
          }}
        >
          404 NOT FOUND
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            fontWeight: 400,
            color: 'common.black',
          }}
        >
          You are in unknown territory!
        </Typography>
        <Button
          onClick={handleBack}
          variant="contained"
          color="primary"
          size="large"
        >
          Go back to safety
        </Button>
      </Box>
    </>
  );
}

export default NotFound;
