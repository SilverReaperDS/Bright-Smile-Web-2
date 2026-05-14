// Shared styles for all Dashboard pages.
// Import with: import dashStyles from './dashboard.styles';

const TEAL = '#0db1ad';
const TEAL_DARK = '#088a87';
const TEAL_SOFT = '#e6faf9';
const CORAL = '#ff7b6b';
const INK = '#0f2a2a';
const MUTED = '#5a6b6b';

const card = {
  borderRadius: 3,
  p: 3,
  boxShadow: '0 4px 20px rgba(13,42,42,0.06)',
  border: '1px solid rgba(13,177,173,0.10)',
  background: '#fff',
  transition: 'all 0.25s ease',
};

const dashStyles = {
  // Palette exposed for consumers
  colors: {
    teal: TEAL,
    tealDark: TEAL_DARK,
    tealSoft: TEAL_SOFT,
    coral: CORAL,
    ink: INK,
    muted: MUTED,
  },

  shell: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f4fbfb 0%, #ffffff 60%)',
  },

  main: {
    flexGrow: 1,
    p: { xs: 2, md: 4 },
    overflow: 'auto',
    minWidth: 0,
  },

  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 2,
    flexWrap: 'wrap',
    mb: 3,
  },

  pageTitle: {
    fontSize: { xs: '1.6rem', md: '2rem' },
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: INK,
    lineHeight: 1.2,
    m: 0,
  },

  pageSubtitle: {
    color: 'text.secondary',
    mt: 0.5,
    fontSize: '0.95rem',
  },

  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: INK,
    mb: 1.5,
  },

  card,

  cardHover: {
    ...card,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 28px rgba(13,42,42,0.10)',
    },
  },

  // Four color variants for stat cards (teal / coral / amber / violet).
  statCardBase: {
    ...card,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 28px rgba(13,42,42,0.10)',
    },
  },

  statVariants: {
    teal: {
      iconBg: 'linear-gradient(135deg, #0db1ad, #088a87)',
      tintBorder: '1px solid rgba(13,177,173,0.18)',
      accent: '#0db1ad',
    },
    coral: {
      iconBg: 'linear-gradient(135deg, #ff7b6b, #ff5c4d)',
      tintBorder: '1px solid rgba(255,123,107,0.22)',
      accent: '#ff7b6b',
    },
    amber: {
      iconBg: 'linear-gradient(135deg, #f4a73b, #e58a17)',
      tintBorder: '1px solid rgba(244,167,59,0.22)',
      accent: '#f4a73b',
    },
    violet: {
      iconBg: 'linear-gradient(135deg, #7a6cf0, #5b4cd6)',
      tintBorder: '1px solid rgba(122,108,240,0.22)',
      accent: '#7a6cf0',
    },
  },

  statIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    flexShrink: 0,
    boxShadow: '0 6px 14px rgba(13,42,42,0.12)',
  },

  statLabel: {
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontSize: '0.72rem',
    fontWeight: 700,
  },

  statValue: {
    fontSize: '2rem',
    fontWeight: 800,
    color: INK,
    lineHeight: 1.1,
    mt: 0.25,
  },

  tableWrap: {
    ...card,
    p: 0,
    overflow: 'hidden',
  },

  tableHeaderCell: {
    fontWeight: 700,
    fontSize: '0.78rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#5a6b6b',
    backgroundColor: '#f4fbfb',
    borderBottom: '2px solid rgba(13,177,173,0.12)',
  },

  primaryBtn: {
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 2,
    px: 3,
    py: 1,
    color: '#fff',
    background: 'linear-gradient(135deg, #0db1ad, #088a87)',
    boxShadow: '0 4px 12px rgba(13,177,173,0.25)',
    transition: 'all 0.25s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #088a87, #066a68)',
      transform: 'translateY(-1px)',
      boxShadow: '0 8px 20px rgba(13,177,173,0.35)',
    },
  },

  outlineBtn: {
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 2,
    px: 2.5,
    py: 0.9,
    borderColor: '#0db1ad',
    color: '#088a87',
    borderWidth: '1.5px',
    '&:hover': {
      borderColor: '#088a87',
      background: '#e6faf9',
      borderWidth: '1.5px',
    },
  },

  alert: {
    borderRadius: 2,
    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
    mb: 2,
  },
};

export default dashStyles;
