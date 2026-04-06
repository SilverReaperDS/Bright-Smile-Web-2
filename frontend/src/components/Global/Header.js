// src/components/Header/Header.js
import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './header.styles';
import { getMe } from '../../services/api';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUsername(data.username);
        setRole(data.role);
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        setUsername(null);
        setRole(null);
      }
    };
    fetchUser();
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setUsername(null);
    setRole(null);
    navigate('/login');
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    {
      label: 'Services',
      children: [
        { label: 'Implants', path: '/implants' },
        { label: 'Invisalign', path: '/invisalign' },
        { label: 'Cosmetic', path: '/cosmetic' },
      ],
    },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'Book appointment', path: '/book-appointment' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <AppBar position="fixed" elevation={scrolled ? 4 : 0} sx={styles.appBar(scrolled)}>
        <Toolbar sx={styles.toolbar}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={styles.logo}
            >
              BrightSmile
            </Typography>
          </Box>

          <Box sx={styles.navLinks}>
            {navLinks.map(({ label, path, children }) =>
              children ? (
                <>
                  <Button
                    color="inherit"
                    onClick={handleMenuOpen}
                    sx={styles.navButton(false)}
                  >
                    {label}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    {children.map(({ label, path }) => (
                      <MenuItem
                        key={path}
                        component={Link}
                        to={path}
                        onClick={handleMenuClose}
                      >
                        {label}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <Button
                  key={path}
                  component={Link}
                  to={path}
                  color="inherit"
                  sx={styles.navButton(isActive(path))}
                >
                  {label}
                </Button>
              )
            )}
          </Box>

          <Box sx={styles.authBox}>
            {username ? (
              <>
                <Typography component="span" variant="body2" sx={styles.greeting}>
                  Hi, {username}
                </Typography>
                {role === 'admin' && (
                  <Button component={Link} to="/dashboard" color="inherit" sx={{ fontWeight: 600 }}>
                    Dashboard
                  </Button>
                )}
                {(role === 'patient' || role === 'staff') && (
                  <Button component={Link} to="/my-dashboard" color="inherit" sx={{ fontWeight: 600 }}>
                    My dashboard
                  </Button>
                )}
                <Button onClick={handleLogout} color="inherit">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" color="inherit">
                  Login
                </Button>
                <Button component={Link} to="/register" color="inherit">
                  Register
                </Button>
              </>
            )}
          </Box>

          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={() => setMenuOpen(true)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box sx={styles.drawerBox}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Menu
          </Typography>
          <List>
            {navLinks.map(({ label, path, children }) =>
              children ? (
                <>
                  <ListItem>
                    <ListItemText primary={label} />
                  </ListItem>
                  {children.map(({ label, path }) => (
                    <ListItem
                      button
                      key={path}
                      component={Link}
                      to={path}
                      selected={isActive(path)}
                      sx={{ pl: 4 }}
                    >
                      <ListItemText primary={label} />
                    </ListItem>
                  ))}
                </>
              ) : (
                <ListItem
                  button
                  key={path}
                  component={Link}
                  to={path}
                  selected={isActive(path)}
                >
                  <ListItemText primary={label} />
                </ListItem>
              )
            )}
          </List>
          <Divider sx={styles.drawerDivider} />
          {username ? (
            <>
              <Typography sx={{ mb: 1 }}>Hi, {username}</Typography>
              {role === 'admin' && (
                <Button
                  component={Link}
                  to="/dashboard"
                  variant="contained"
                  fullWidth
                  sx={{ mb: 1 }}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Button>
              )}
              {(role === 'patient' || role === 'staff') && (
                <Button
                  component={Link}
                  to="/my-dashboard"
                  variant="contained"
                  fullWidth
                  sx={{ mb: 1 }}
                  onClick={() => setMenuOpen(false)}
                >
                  My dashboard
                </Button>
              )}
              <Button variant="outlined" fullWidth onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                fullWidth
                sx={styles.drawerLoginButton}
              >
                Login
              </Button>
              <Button component={Link} to="/register" fullWidth>
                Register
              </Button>
            </>
          )}
        </Box>
      </Drawer>

      <Toolbar />
    </>
  );
}
