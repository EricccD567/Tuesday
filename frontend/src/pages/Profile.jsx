import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  LargeAvatar,
  ProfileButtons,
  ProfileButtonsConnected,
  ProfileCircularStatusBar,
} from '../components';
import { getProfile, getAnyUserProfile } from '../helper/ApiHelper';

function Profile(props) {
  const navigate = useNavigate();

  const { redirectUnauthorized } = props;

  // checks if the profile is of the current user or not
  const currentUserId = localStorage.getItem('u_id');
  const urlParams = useParams();
  const urlUserId = urlParams['userId'];
  const isSelf = urlUserId === undefined || urlUserId === currentUserId;

  // state variables that store the details of the user
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [weeklyWorkHours, setWeeklyWorkHours] = useState(0);
  const [workloadStatus, setWorkloadStatus] = useState(0);

  // display value and text for weekly work hours - display a maximum of 70, more is shown as 70+
  const weeklyWorkHoursValue = weeklyWorkHours > 70 ? 70 : weeklyWorkHours;
  const weeklyWorkHoursText = weeklyWorkHours > 70 ? '70+ Hours' : `${weeklyWorkHours} Hours`;

  // display value and text for workload status - display a maximum of 100, more is shown as 100+
  const workloadStatusValue = workloadStatus > 100 ? 100 : workloadStatus;
  const workloadStatusText = workloadStatus > 100 ? '100%+' : `${workloadStatus}%`;

  // get the profile details based on if its the current user or connected user
  useEffect(() => {
    if (redirectUnauthorized()) {
      navigate('/login');
      return;
    }

    toast.loading('Loading...', {
      id: 'loading',
    });
    if (isSelf) {
      // current user profile
      getProfile(localStorage.getItem('token'))
        .then((result) => {
          setAvatar(result['avatar']);
          setName(result['first_name'] + ' ' + result['last_name']);
          setEmail(result['email']);
          setWeeklyWorkHours(result['weekly_work_hours']);
          setWorkloadStatus(result['workload_status']);
          toast.success('Loaded!', {
            id: 'loaded',
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      // not current user profile (either connected user profile or not found)
      getAnyUserProfile(localStorage.getItem('token'), +urlUserId)
        .then((result) => {
          setAvatar(result['avatar']);
          setName(result['first_name'] + ' ' + result['last_name']);
          setEmail(result['email']);
          setWeeklyWorkHours(result['weekly_work_hours']);
          setWorkloadStatus(result['workload_status']);
          toast.success('Loaded!', {
            id: 'loaded',
          });
        })
        .catch((error) => {
          console.log(error.message);
          navigate('/404');
        });
    }
    // eslint-disable-next-line
  }, [isSelf]);

  return (
    <Stack
      direction="column"
      spacing={{ xs: 4, md: 9 }}
      sx={{
        mx: { xs: 7.5, md: 15, lg: 20, xl: 30 },
        my: { xs: 5, md: 10 },
      }}
    >
      <Box
        component={Paper}
        elevation={2}
        sx={{
          py: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          rowGap: 4,
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <LargeAvatar avatar={avatar} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: { xs: 3, md: 9 },
            alignItems: { xs: 'center', md: 'flex-start' },
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: 500, mr: { xs: 0, md: 6 } }}
          >
            {name}
          </Typography>
          <TextField
            id="profile-email"
            key={email}
            disabled
            size="small"
            fullWidth={true}
            label="Email"
            defaultValue={email}
          />
        </Box>
        {isSelf ? (
          <ProfileButtons oldAvatar={avatar} weeklyWorkHours={weeklyWorkHours} />
        ) : (
          <ProfileButtonsConnected urlUserId={urlUserId} />
        )}
      </Box>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 4, md: 6 }}
        alignItems="center"
      >
        <ProfileCircularStatusBar
          heading={'Max Weekly Hours Worked'}
          maxValue={70}
          value={weeklyWorkHoursValue}
          text={weeklyWorkHoursText}
        />
        <ProfileCircularStatusBar
          heading={'Workload Activity Status'}
          maxValue={100}
          value={workloadStatusValue}
          text={workloadStatusText}
        />
      </Stack>
    </Stack>
  );
}

export default Profile;
