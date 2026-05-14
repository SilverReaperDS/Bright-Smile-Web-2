const TEAL = '#0db1ad';
const TEAL_DARK = '#0a8f8c';
const CORAL = '#ff7b6b';
const INK = '#0f2a2a';

const styles = {
  section: {
    py: { xs: 5, md: 7 },
    background:
      'radial-gradient(1200px 500px at 20% 0%, rgba(13,177,173,0.14) 0%, rgba(255,255,255,0) 55%), radial-gradient(900px 450px at 85% 10%, rgba(255,123,107,0.14) 0%, rgba(255,255,255,0) 60%), #ffffff',
  },
  heading: {
    fontWeight: 900,
    color: INK,
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
    textAlign: 'center',
    mb: 2.5,
    '&::after': {
      content: '""',
      display: 'block',
      width: 90,
      height: 6,
      borderRadius: 99,
      mx: 'auto',
      mt: 2,
      background: `linear-gradient(90deg, ${TEAL} 0%, ${CORAL} 100%)`,
      boxShadow: '0 10px 22px -14px rgba(13,177,173,0.7)',
    },
  },
  paragraph: {
    color: 'rgba(15,42,42,0.85)',
    fontSize: { xs: '1rem', md: '1.05rem' },
    lineHeight: 1.8,
  },
  subheading: {
    fontWeight: 800,
    color: INK,
    mb: 2,
  },
  list: {
    mt: 1,
    mb: 2,
    py: 0,
  },
  listItem: {
    px: 0,
    py: 0.25,
    '& .MuiListItemText-primary': {
      fontWeight: 600,
      color: 'rgba(15,42,42,0.82)',
    },
  },
  calloutBox: {
    mt: { xs: 5, md: 7 },
    p: { xs: 3, md: 4 },
    borderRadius: 3,
    color: 'white',
    background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 55%, ${CORAL} 140%)`,
    boxShadow: '0 26px 60px -34px rgba(15,42,42,0.55)',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  buttonPrimary: {
    backgroundColor: CORAL,
    color: INK,
    fontWeight: 900,
    textTransform: 'none',
    px: 3,
    py: 1.25,
    borderRadius: '14px',
    boxShadow: '0 14px 30px -18px rgba(255,123,107,0.9)',
    '&:hover': {
      backgroundColor: '#ff6f5c',
      boxShadow: '0 18px 34px -20px rgba(255,123,107,0.95)',
    },
  },
};

export default styles;
