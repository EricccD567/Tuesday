import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function ProfileCircularStatusBar({ heading, maxValue, value, text }) {
  return (
    <Paper
      elevation={2}
      sx={{
        width: 300,
        height: 300,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 500 }}>
        {heading}
      </Typography>
      <Box sx={{ width: 200, height: 200 }}>
        <CircularProgressbar
          maxValue={maxValue}
          value={value}
          text={text}
          styles={buildStyles({
            textSize: '14px',
            textColor: `hsl(${(1 - value / maxValue) * 120}, 100%, 50%)`,
            pathColor: `hsl(${(1 - value / maxValue) * 120}, 100%, 50%)`,
          })}
        />
      </Box>
    </Paper>
  );
}

export default ProfileCircularStatusBar;
