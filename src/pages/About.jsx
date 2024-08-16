import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function About() {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="h3"
        sx={{
          mt: 8,
          mb: 4,
          fontWeight: 700,
          color: 'common.black',
        }}
      >
        {/* heading */}
        About Us
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mx: { xs: 10, md: 30 },
          fontWeight: 400,
          color: 'common.black',
        }}
      >
        {/* description */}
        Tuesday is a modern task management system that takes productivity to
        the next level. It allows users (task masters) to add team members and
        create tasks seamlessly. Unlike other task management systems, our
        built-in self-reflection system provides daily analytical feedback and
        personalised suggestions for accelerated task improvements. Furthermore,
        our state of the art priority algorithm provides a ordered list of tasks
        to do next so users can avoid struggling to meet deadlines.
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mx: { xs: 10, md: 30 },
          mt: 7,
          fontWeight: 200,
          color: 'text.secondary',
        }}
      >
        Made by M10B Banana: Eric Dai, Kevin Hu, Luke Simmonds, Taimoor Khan & Vanessa Xia
      </Typography>
    </Box>
  );
}

export default About;
