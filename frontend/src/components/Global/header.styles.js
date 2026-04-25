// src/components/Header/header.styles.js

const TEAL = '#0db1ad';
const TEAL_DARK = '#0a8f8c';
const CORAL = '#ff7b6b';
const INK = '#0f2a2a';
const LINE = 'rgba(255,255,255,0.16)';

const styles = {
  appBar: (scrolled) => ({
    background: scrolled
      ? `linear-gradient(90deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`
      : `linear-gradient(90deg, rgba(13,177,173,0.92) 0%, rgba(10,143,140,0.92) 100%)`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
    boxShadow: scrolled
      ? '0 6px 24px -12px rgba(15, 42, 42, 0.35)'
      : 'none',
    transition: 'background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
  }),
  topBar: {
    display: { xs: 'none', md: 'block' },
    borderBottom: `1px solid rgba(255,255,255,0.12)`,
    background: 'rgba(0,0,0,0.08)',
  },
  topBarInner: {
    minHeight: 34,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: { xs: 2, sm: 3, md: 4 },
  },
  topBarGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  topBarGroupRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  topBarItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.75,
    color: 'rgba(255,255,255,0.92)',
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.01em',
    whiteSpace: 'nowrap',
  },
  topBarIcon: {
    fontSize: 16,
    opacity: 0.92,
  },
  topBarText: {
    color: 'rgba(255,255,255,0.92)',
  },
  topBarLink: {
    color: 'rgba(255,255,255,0.92)',
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  },
  toolbar: {
    minHeight: { xs: 64, md: 72 },
    px: { xs: 2, sm: 3, md: 0 },
  },
  toolbarInner: {
    display: 'flex',
    alignItems: 'center',
    minHeight: { xs: 64, md: 72 },
    gap: 2,
    px: { xs: 0, sm: 0, md: 4 },
  },
  brandBox: {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    minWidth: 180,
  },
  logo: {
    textDecoration: 'none',
    color: 'white',
    fontWeight: 800,
    fontSize: { xs: '1.15rem', md: '1.3rem' },
    letterSpacing: '-0.01em',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1,
    lineHeight: 1,
    '& .logo-dot': {
      display: 'inline-block',
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: CORAL,
      boxShadow: '0 0 0 3px rgba(255,123,107,0.22)',
      flexShrink: 0,
    },
    '&:hover .logo-dot': {
      transform: 'scale(1.15)',
    },
    '& .logo-dot': {
      transition: 'transform 0.25s ease',
    },
  },
  navLinks: {
    flex: 1,
    display: { xs: 'none', md: 'flex' },
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0.5,
  },
  navButton: (active) => ({
    position: 'relative',
    fontWeight: active ? 700 : 500,
    color: 'white',
    fontSize: '0.9375rem',
    textTransform: 'none',
    letterSpacing: '0.01em',
    px: 1.75,
    py: 1,
    borderRadius: '10px',
    minWidth: 'auto',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    '&::after': {
      content: '""',
      position: 'absolute',
      left: '50%',
      bottom: 6,
      transform: active ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
      transformOrigin: 'center',
      width: 20,
      height: 3,
      borderRadius: 2,
      backgroundColor: CORAL,
      transition: 'transform 0.25s ease',
    },
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.12)',
    },
    '&:hover::after': {
      transform: 'translateX(-50%) scaleX(1)',
    },
    '&:focus-visible': {
      outline: '2px solid rgba(255,255,255,0.7)',
      outlineOffset: 2,
    },
  }),
  actions: {
    flex: '0 0 auto',
    display: { xs: 'none', md: 'flex' },
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 1.25,
  },
  ctaButton: {
    color: TEAL_DARK,
    backgroundColor: 'rgba(255,255,255,0.96)',
    fontWeight: 900,
    fontSize: '0.9rem',
    textTransform: 'none',
    px: 1.75,
    py: 0.8,
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.55)',
    boxShadow: '0 10px 22px -14px rgba(15,42,42,0.38)',
    '&:hover': {
      backgroundColor: '#ffffff',
      boxShadow: '0 14px 30px -18px rgba(15,42,42,0.48)',
    },
    '&::after': {
      content: '""',
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: CORAL,
      marginLeft: 10,
      boxShadow: '0 0 0 3px rgba(255,123,107,0.18)',
    },
  },
  accountButton: {
    color: 'rgba(255,255,255,0.92)',
    border: `1px solid ${LINE}`,
    borderRadius: '12px',
    p: 1,
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
  },
  accountMenuHeader: {
    fontSize: '0.85rem',
    color: 'rgba(15,42,42,0.75)',
    cursor: 'default',
    opacity: 1,
  },
  greeting: {
    color: 'rgba(255,255,255,0.92)',
    lineHeight: 1,
    fontSize: '0.9375rem',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    mr: 0.5,
  },
  authButton: {
    color: 'white',
    fontWeight: 500,
    fontSize: '0.9rem',
    textTransform: 'none',
    px: 1.5,
    py: 0.75,
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.12)',
    },
  },
  authButtonPrimary: {
    color: TEAL,
    backgroundColor: 'white',
    fontWeight: 700,
    fontSize: '0.9rem',
    textTransform: 'none',
    px: 2,
    py: 0.75,
    borderRadius: '10px',
    boxShadow: '0 2px 8px -2px rgba(15,42,42,0.25)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.92)',
    },
  },
  mobileMenuButton: {
    display: { xs: 'inline-flex', md: 'none' },
    color: 'white',
    border: `1px solid ${LINE}`,
    borderRadius: '10px',
    p: 1,
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.12)',
    },
  },
  offset: {
    // AppBar contains the top bar on md+
    minHeight: { xs: 64, md: 106 },
  },

  // ---------- Drawer (mobile menu) ----------
  drawerPaper: {
    width: 300,
    background: '#ffffff',
    color: INK,
    borderLeft: `1px solid rgba(15,42,42,0.06)`,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: 2.5,
    py: 2,
    background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
    color: 'white',
  },
  drawerBrand: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1,
    fontWeight: 800,
    fontSize: '1.15rem',
    letterSpacing: '-0.01em',
  },
  drawerBrandDot: {
    display: 'inline-block',
    width: 9,
    height: 9,
    borderRadius: '50%',
    background: CORAL,
    boxShadow: '0 0 0 3px rgba(255,255,255,0.18)',
  },
  drawerClose: {
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.14)',
    },
  },
  drawerBody: {
    p: 1.5,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  drawerSectionLabel: {
    px: 1.5,
    pt: 1.5,
    pb: 0.5,
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(15,42,42,0.5)',
  },
  drawerItem: {
    borderRadius: '10px',
    mb: 0.25,
    px: 1.5,
    py: 1,
    color: INK,
    transition: 'background-color 0.18s ease, color 0.18s ease',
    '& .MuiListItemText-primary': {
      fontWeight: 500,
      fontSize: '0.95rem',
    },
    '&:hover': {
      backgroundColor: 'rgba(13,177,173,0.08)',
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(13,177,173,0.12)',
      color: TEAL_DARK,
      '& .MuiListItemText-primary': {
        fontWeight: 700,
      },
    },
    '&.Mui-selected:hover': {
      backgroundColor: 'rgba(13,177,173,0.18)',
    },
  },
  drawerChildItem: {
    borderRadius: '10px',
    mb: 0.25,
    ml: 1.5,
    pl: 2,
    py: 0.75,
    color: 'rgba(15,42,42,0.8)',
    borderLeft: '2px solid rgba(13,177,173,0.22)',
    transition: 'background-color 0.18s ease, color 0.18s ease',
    '& .MuiListItemText-primary': {
      fontSize: '0.9rem',
      fontWeight: 500,
    },
    '&:hover': {
      backgroundColor: 'rgba(13,177,173,0.08)',
      borderLeftColor: TEAL,
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(13,177,173,0.14)',
      color: TEAL_DARK,
      borderLeftColor: CORAL,
      '& .MuiListItemText-primary': {
        fontWeight: 700,
      },
    },
  },
  drawerDivider: {
    my: 1.5,
    borderColor: 'rgba(15,42,42,0.08)',
  },
  drawerFooter: {
    px: 1.5,
    pb: 2,
    mt: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  drawerGreeting: {
    px: 1.5,
    fontSize: '0.9rem',
    color: 'rgba(15,42,42,0.7)',
    mb: 0.5,
  },
  drawerPrimaryButton: {
    backgroundColor: TEAL,
    color: 'white',
    fontWeight: 700,
    textTransform: 'none',
    borderRadius: '10px',
    py: 1,
    boxShadow: '0 4px 12px -4px rgba(13,177,173,0.5)',
    '&:hover': {
      backgroundColor: TEAL_DARK,
    },
  },
  drawerSecondaryButton: {
    color: INK,
    borderColor: 'rgba(15,42,42,0.18)',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '10px',
    py: 1,
    '&:hover': {
      borderColor: TEAL,
      color: TEAL_DARK,
      backgroundColor: 'rgba(13,177,173,0.06)',
    },
  },
  drawerLoginButton: {
    // kept for backward compatibility if referenced anywhere
    mb: 1,
    backgroundColor: TEAL,
    color: 'white',
    fontWeight: 700,
    textTransform: 'none',
    borderRadius: '10px',
  },
};

export default styles;