// src/components/Header/header.styles.js

const styles = {
  appBar: (scrolled) => ({
    backgroundColor: scrolled ? '#0db1ad' : 'rgba(13, 177, 173, 0.85)',
    backdropFilter: 'blur(6px)',
    transition: 'background-color 0.3s ease',
  }),
  toolbar: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    textDecoration: 'none',
    color: 'white',
    fontWeight: 700,
    fontSize: 22,
  },
  navLinks: {
    flex: 2,
    display: { xs: 'none', md: 'flex' },
    justifyContent: 'center',
    gap: 2,
  },
  navButton: (active) => ({
    fontWeight: active ? 700 : 400,
    borderBottom: active ? '2px solid white' : 'none',
    borderRadius: 0,
    color: active ? '#1976d2' : 'white', // blue when active
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
  }),
  authBox: {
    flex: 1,
    display: { xs: 'none', md: 'flex' },
    justifyContent: 'flex-end',
    gap: 1,
  },
  drawerBox: {
    width: 250,
    p: 2,
  },
  drawerDivider: {
    my: 2,
  },
  drawerLoginButton: {
    mb: 1,
    backgroundColor: '#0db1ad',
    color: 'white',
    fontWeight: 600,
  },
  drawerItem: {
    '&.Mui-selected': {
      color: '#1976d2', 
      fontWeight: 700,
      borderBottom: '2px solid #1976d2', 
      backgroundColor: 'transparent', 
    },
  },
  drawerChildItem: {
    pl: 4,
    '&.Mui-selected': {
      color: '#1976d2',
      fontWeight: 700,
      borderBottom: '2px solid #1976d2',
      backgroundColor: 'transparent',
    },
  },
};

export default styles;