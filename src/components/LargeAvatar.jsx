import React from 'react';
import Avatar from '@mui/material/Avatar';

function LargeAvatar({ avatar }) {
  return (
    <Avatar
      alt="Avatar"
      src={avatar || ''}
      imgProps={{
        style: {
          maxHeight: '100%',
          maxWidth: '100%',
          objectFit: 'cover',
        },
      }}
      sx={{ width: 250, height: 250, bgcolor: 'secondary.main' }}
    />
  );
}

export default LargeAvatar;
