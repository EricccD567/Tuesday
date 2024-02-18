import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { GraphRow } from '../components';
import { getReport } from '../helper/ApiHelper';

function SelfReflection(props) {
  const navigate = useNavigate();

  const { redirectUnauthorized } = props;

  const [graph1, setGraph1] = useState('');
  const [graph2, setGraph2] = useState('');
  const [graph3, setGraph3] = useState('');

  useEffect(() => {
    // redirect user to login page if they are not logged in
    if (redirectUnauthorized()) {
      navigate('/login');
      return;
    }
    // call backend to generate the user's graphs
    toast.loading('Loading...', {
      id: 'loading',
    });
    getReport(localStorage.getItem('token'))
      .then((result) => {
        setGraph1(`data:image/jpeg;base64,${result['plot_1']}`);
        setGraph2(`data:image/jpeg;base64,${result['plot_2']}`);
        setGraph3(`data:image/jpeg;base64,${result['plot_3']}`);
        toast.success('Loaded!', {
          id: 'loaded',
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
    // eslint-disable-next-line
  }, []);

  // graph descriptions
  const description1 =
    'This graph shows the estimated number of hours to complete a task versus the number of hours it took. The actual number of hours taken to complete a task was computed by comparing the time that a task was set to "in-progress" with the time when it was set to "completed".';
  const description2 =
    'This table shows information about when a task was completed and whether it was completed before or after the deadline. A task is considered "finished" when it is marked as "completed" on the task board.';
  const description3 =
    'This graph shows the workload activity status for the user for the next 7 days. This is done by computing the workload activity percentage for the user at 9 am on each day. This is achieved by taking all the tasks that are due over the next 7 days from the chosen date, adding the estimated working hours for each task, and dividing it by the max number of hours that a user will work in a week.';

  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            mt: 4,
            mb: 4,
            fontWeight: 700,
            color: 'common.black',
          }}
        >
          Self-Reflection
        </Typography>
      </Box>
      <Stack
        spacing={10}
        alignItems="center"
        justifyContent="space-evenly"
        sx={{ mb: 4 }}
      >
        <GraphRow
          title="Estimated Time vs Actual Time for Task Completion"
          graphDescription={description1}
          imageSrc={graph1}
        />
        <GraphRow
          title="Adherence to Task Deadlines"
          graphDescription={description2}
          imageSrc={graph2}
        />
        <GraphRow
          title="Workload Percentage Over the Week"
          graphDescription={description3}
          imageSrc={graph3}
        />
      </Stack>
    </>
  );
}

export default SelfReflection;
