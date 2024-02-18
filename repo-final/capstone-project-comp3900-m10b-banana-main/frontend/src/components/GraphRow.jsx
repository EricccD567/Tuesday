import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function GraphRow({ title, imageSrc, graphDescription }) {
  return (
    <Stack alignItems="center" direction="column" spacing={4}>
      <Paper
        elevation={2}
        sx={{
          width: 1000,
          height: 600,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <Box>
          {/* graph image here */}
          <img
            src={imageSrc || ''}
            max-width="900px"
            height="500px"
            alt={title}
          />
        </Box>
      </Paper>
      <Box sx={{ width: 500 }}>
        <Typography variant="body2" sx={{ fontWeight: 400 }}>
          {/* graph description here */}
          {graphDescription}
        </Typography>
      </Box>
    </Stack>
  );
}

export default GraphRow;
