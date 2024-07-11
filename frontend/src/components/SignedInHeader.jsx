import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LogoutConfirmDialog from './LogoutConfirmDialog';
import { getAvatar } from '../helper/ApiHelper';

// nav links
const pages = [
  { page: 'Taskboard', route: 'taskboard' },
  { page: 'Connected Taskmasters', route: 'connected-taskmasters' },
  { page: 'Create A New Task', route: 'create-task' },
];

// profile icon settings
const settings = [{ page: 'Profile', route: 'profile' }];

const SignedInHeader = () => {
  // state to store anchor element navigation for mobile menu (nav links)
  const [anchorElNav, setAnchorElNav] = useState(null);

  // open mobile nav menu
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  // close mobile nav menu
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // state to store anchor element user for desktop and mobile menu (profile settings)
  const [anchorElUser, setAnchorElUser] = useState(null);

  // open profile menu
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  // close profile menu
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // open state of logout confirmation dialog
  const [isOpenLogoutDialog, setIsOpenLogoutDialog] = useState(false);

  // open logout confirmation dialog
  const handleOpenLogoutDialog = () => {
    setIsOpenLogoutDialog(true);
    setAnchorElUser(null);
  };
  // close logout confirmation dialog
  const handleCloseLogoutDialog = () => {
    setIsOpenLogoutDialog(false);
  };

  // state to store avatar displayed in nav
  const [avatar, setAvatar] = useState('');

  // fetch avatar for nav
  useEffect(() => {
    getAvatar(localStorage.getItem('token'))
      .then((result) => {
        setAvatar(result['avatar']);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          {/* Mobile View */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.page}
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={`/${page.route}`}
                >
                  <Typography textAlign="center">{page.page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* Desktop and Mobile View */}
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/taskboard"
            sx={{
              fontFamily: 'Roboto',
              fontWeight: 900,
              color: 'neutral.main',
            }}
          >
            Tuesday
          </Typography>
          {/* Desktop View */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.page}
                onClick={handleCloseNavMenu}
                component={RouterLink}
                to={`/${page.route}`}
                sx={{ my: 2, mx: 1, color: 'neutral.main', display: 'block' }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {page.page}
                </Typography>
              </Button>
            ))}
          </Box>
          {/* Desktop and Mobile View */}
          <Box>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="Avatar"
                  src={avatar || ""}
                  imgProps={{
                    style: {
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "cover",
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.page}
                  onClick={handleCloseUserMenu}
                  component={RouterLink}
                  to={`/${setting.route}`}
                >
                  <Typography textAlign="center">{setting.page}</Typography>
                </MenuItem>
              ))}
              <MenuItem key="Logout" onClick={handleOpenLogoutDialog}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
              <LogoutConfirmDialog
                isOpen={isOpenLogoutDialog}
                handleClose={handleCloseLogoutDialog}
              />
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default SignedInHeader;
