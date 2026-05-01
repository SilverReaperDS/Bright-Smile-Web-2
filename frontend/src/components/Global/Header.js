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
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './header.styles';
import { getMe } from '../../services/api';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const [servicesAnchorEl, setServicesAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
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

  const handleServicesMenuOpen = (event) => setServicesAnchorEl(event.currentTarget);
  const handleServicesMenuClose = () => setServicesAnchorEl(null);
  const handleAccountMenuOpen = (event) => setAccountAnchorEl(event.currentTarget);
  const handleAccountMenuClose = () => setAccountAnchorEl(null);

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
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <AppBar position="fixed" elevation={scrolled ? 4 : 0} sx={styles.appBar(scrolled)}>
        <Box sx={styles.topBar}>
          <Container maxWidth="lg" sx={styles.topBarInner}>
            <Box sx={styles.topBarGroup}>
              <Box sx={styles.topBarItem}>
                <LocalPhoneIcon sx={styles.topBarIcon} />
                <Box
                  component="a"
                  href="tel:+970000000000"
                  sx={styles.topBarLink}
                  aria-label="Call BrightSmile"
                >
                  +970 00 000 0000
                </Box>
              </Box>
              <Box sx={styles.topBarItem}>
                <PlaceIcon sx={styles.topBarIcon} />
                <Box component="span" sx={styles.topBarText}>
                  Nablus
                </Box>
              </Box>
            </Box>
            <Box sx={styles.topBarGroupRight}>
              <Box sx={styles.topBarItem}>
                <AccessTimeIcon sx={styles.topBarIcon} />
                <Box component="span" sx={styles.topBarText}>
                  Sat–Thu 9:00–18:00
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        <Toolbar disableGutters sx={styles.toolbar}>
          <Container maxWidth="lg" sx={styles.toolbarInner}>
            <Box sx={styles.brandBox}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={styles.logo}
              aria-label="BrightSmile home"
            >
              <span className="logo-dot" aria-hidden="true" />
              BrightSmile
            </Typography>
            </Box>

            <Box sx={styles.navLinks}>
            {navLinks.map(({ label, path, children }) =>
              children ? (
                <React.Fragment key={label}>
                  <Button
                    color="inherit"
                    onClick={handleServicesMenuOpen}
                    sx={styles.navButton(false)}
                  >
                    {label}
                  </Button>
                  <Menu
                    anchorEl={servicesAnchorEl}
                    open={Boolean(servicesAnchorEl)}
                    onClose={handleServicesMenuClose}
                  >
                    {children.map(({ label, path }) => (
                      <MenuItem
                        key={path}
                        component={Link}
                        to={path}
                        onClick={handleServicesMenuClose}
                      >
                        {label}
                      </MenuItem>
                    ))}
                  </Menu>
                </React.Fragment>
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

            <Box sx={styles.actions}>
              <Button component={Link} to="/book-appointment" sx={styles.ctaButton}>
                Book appointment
              </Button>

              {username ? (
                <>
                  <IconButton
                    aria-label="Account menu"
                    onClick={handleAccountMenuOpen}
                    sx={styles.accountButton}
                  >
                    <AccountCircleIcon />
                  </IconButton>
                  <Menu
                    anchorEl={accountAnchorEl}
                    open={Boolean(accountAnchorEl)}
                    onClose={handleAccountMenuClose}
                  >
                    <MenuItem disabled sx={styles.accountMenuHeader}>
                      Signed in as <strong style={{ marginLeft: 6 }}>{username}</strong>
                    </MenuItem>
                    <Divider />
                    {role === 'admin' && (
                      <MenuItem
                        component={Link}
                        to="/dashboard"
                        onClick={handleAccountMenuClose}
                      >
                        Dashboard
                      </MenuItem>
                    )}
                    {(role === 'patient' || role === 'staff') && (
                      <MenuItem
                        component={Link}
                        to="/my-dashboard"
                        onClick={handleAccountMenuClose}
                      >
                        My dashboard
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => {
                        handleAccountMenuClose();
                        handleLogout();
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button component={Link} to="/login" sx={styles.authButton}>
                  Login
                </Button>
              )}
            </Box>

            <IconButton
              edge="end"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              sx={styles.mobileMenuButton}
            >
              <MenuIcon />
            </IconButton>
          </Container>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        PaperProps={{ sx: styles.drawerPaper }}
      >
        <Box sx={styles.drawerHeader}>
          <Box sx={styles.drawerBrand}>
            <span style={styles.drawerBrandDot} />
            BrightSmile
          </Box>
          <IconButton
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            sx={styles.drawerClose}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={styles.drawerBody}>
          <Typography sx={styles.drawerSectionLabel}>Navigate</Typography>
          <List disablePadding>
            {navLinks.map(({ label, path, children }) =>
              children ? (
                <React.Fragment key={label}>
                  <ListItem sx={{ ...styles.drawerItem, opacity: 0.75 }} disabled>
                    <ListItemText primary={label} />
                  </ListItem>
                  {children.map((child) => (
                    <ListItem
                      button
                      key={child.path}
                      component={Link}
                      to={child.path}
                      selected={isActive(child.path)}
                      onClick={() => setMenuOpen(false)}
                      sx={styles.drawerChildItem}
                    >
                      <ListItemText primary={child.label} />
                    </ListItem>
                  ))}
                </React.Fragment>
              ) : (
                <ListItem
                  button
                  key={path}
                  component={Link}
                  to={path}
                  selected={isActive(path)}
                  onClick={() => setMenuOpen(false)}
                  sx={styles.drawerItem}
                >
                  <ListItemText primary={label} />
                </ListItem>
              )
            )}
          </List>

          <Divider sx={styles.drawerDivider} />

          <Box sx={styles.drawerFooter}>
            <Button
              component={Link}
              to="/book-appointment"
              fullWidth
              sx={styles.drawerPrimaryButton}
              onClick={() => setMenuOpen(false)}
            >
              Book appointment
            </Button>
            {username ? (
              <>
                <Typography sx={styles.drawerGreeting}>
                  Hi, <strong>{username}</strong>
                </Typography>
                {role === 'admin' && (
                  <Button
                    component={Link}
                    to="/dashboard"
                    fullWidth
                    sx={styles.drawerPrimaryButton}
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Button>
                )}
                {(role === 'patient' || role === 'staff') && (
                  <Button
                    component={Link}
                    to="/my-dashboard"
                    fullWidth
                    sx={styles.drawerPrimaryButton}
                    onClick={() => setMenuOpen(false)}
                  >
                    My dashboard
                  </Button>
                )}
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  sx={styles.drawerSecondaryButton}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  fullWidth
                  sx={styles.drawerPrimaryButton}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="outlined"
                  fullWidth
                  sx={styles.drawerSecondaryButton}
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>

      <Box sx={styles.offset} />
    </>
  );
}
