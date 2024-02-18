import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

// nav links
const pages = [
  { page: 'Get Started', route: '' },
  { page: 'About', route: 'about' },
];

const SignedOutHeader = () => {
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
            to="/"
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
          <Box sx={{ display: 'flex' }}>
            <Button
              variant="outlined"
              color="neutral"
              component={RouterLink}
              to="/login"
              sx={{ mr: 1, color: 'neutral.main' }}
            >
              LOG IN
            </Button>
            <Button
              variant="contained"
              color="neutral"
              component={RouterLink}
              to="/signup"
              sx={{ color: 'primary.main' }}
            >
              SIGN UP
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default SignedOutHeader;
