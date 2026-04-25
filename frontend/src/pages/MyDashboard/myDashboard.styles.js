// src/pages/MyDashboard/myDashboard.styles.js

const TEAL = '#0db1ad';
const TEAL_DARK = '#088a87';
const TEAL_SOFT = '#e6faf9';
const CORAL = '#ff7b6b';
const INK = '#0f2a2a';
const MUTED = '#5a6b6b';

const styles = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    py: { xs: 4, md: 6 },
    px: { xs: 2, md: 3 },
    background:
      'linear-gradient(180deg, #f4fbfb 0%, #ffffff 55%, #f7fcfc 100%)',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-120px',
      right: '-120px',
      width: '380px',
      height: '380px',
      borderRadius: '50%',
      background:
        'radial-gradient(circle, rgba(13,177,173,0.14) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-140px',
      left: '-100px',
      width: '340px',
      height: '340px',
      borderRadius: '50%',
      background:
        'radial-gradient(circle, rgba(255,123,107,0.12) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
  },
  container: {
    maxWidth: 1080,
    mx: 'auto',
    position: 'relative',
    zIndex: 1,
  },
  eyebrow: {
    display: 'inline-block',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: TEAL_DARK,
    background: TEAL_SOFT,
    px: 2,
    py: 0.75,
    borderRadius: 999,
    mb: 1.5,
  },
  heading: {
    fontWeight: 800,
    fontSize: { xs: '2rem', md: '2.5rem' },
    letterSpacing: '-0.02em',
    color: INK,
    mb: 0.5,
    background: `linear-gradient(90deg, ${TEAL_DARK}, ${TEAL})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subheading: {
    color: MUTED,
    fontSize: { xs: '0.98rem', md: '1.08rem' },
    lineHeight: 1.6,
    mb: 4,
    maxWidth: 680,
  },
  tabsWrap: {
    mb: 3,
    background: '#ffffff',
    borderRadius: 3,
    boxShadow: '0 4px 18px rgba(13, 42, 42, 0.06)',
    border: '1px solid rgba(13,177,173,0.10)',
    px: 1,
    '& .MuiTabs-indicator': {
      height: 3,
      borderRadius: 2,
      background: `linear-gradient(90deg, ${TEAL}, ${TEAL_DARK})`,
    },
    '& .MuiTab-root': {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.95rem',
      color: MUTED,
      minHeight: 56,
      transition: 'color 0.2s',
      '&.Mui-selected': { color: TEAL_DARK },
      '&:hover': { color: INK },
    },
  },
  card: {
    p: { xs: 2, md: 3 },
    borderRadius: 3,
    background: '#ffffff',
    border: '1px solid rgba(13,177,173,0.10)',
    boxShadow: '0 4px 20px rgba(13,42,42,0.06)',
  },
  // Messages
  threadListCard: {
    width: { xs: '100%', md: 300 },
    flexShrink: 0,
    borderRadius: 3,
    background: '#ffffff',
    border: '1px solid rgba(13,177,173,0.10)',
    boxShadow: '0 4px 20px rgba(13,42,42,0.06)',
    overflow: 'hidden',
    maxHeight: { md: 560 },
  },
  threadHeader: {
    px: 2,
    py: 1.5,
    borderBottom: '1px solid rgba(13,177,173,0.10)',
    background: '#f7fcfc',
    fontWeight: 700,
    fontSize: '0.78rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: MUTED,
  },
  threadItem: (selected) => ({
    py: 1.5,
    px: 2,
    borderLeft: selected ? `3px solid ${TEAL}` : '3px solid transparent',
    background: selected ? TEAL_SOFT : 'transparent',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: selected ? TEAL_SOFT : '#f7fcfc',
    },
    '&.Mui-selected': {
      background: TEAL_SOFT,
    },
    '&.Mui-selected:hover': {
      background: TEAL_SOFT,
    },
  }),
  conversationCard: {
    flex: 1,
    p: { xs: 2, md: 3 },
    borderRadius: 3,
    background: '#ffffff',
    border: '1px solid rgba(13,177,173,0.10)',
    boxShadow: '0 4px 20px rgba(13,42,42,0.06)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 480,
  },
  conversationMeta: {
    pb: 1.5,
    mb: 2,
    borderBottom: '1px dashed rgba(13,177,173,0.20)',
    color: MUTED,
    fontWeight: 600,
    fontSize: '0.82rem',
    letterSpacing: '0.03em',
  },
  messagesScroll: {
    flex: 1,
    overflow: 'auto',
    mb: 2,
    pr: 1,
    maxHeight: { xs: 360, md: 420 },
    '&::-webkit-scrollbar': { width: 6 },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(13,177,173,0.25)',
      borderRadius: 3,
    },
  },
  bubbleRow: (mine) => ({
    mb: 1.5,
    display: 'flex',
    justifyContent: mine ? 'flex-end' : 'flex-start',
  }),
  bubble: (mine) => ({
    px: 2,
    py: 1.25,
    maxWidth: '78%',
    borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
    background: mine
      ? `linear-gradient(135deg, ${TEAL}, ${TEAL_DARK})`
      : '#f4f6f6',
    color: mine ? '#ffffff' : INK,
    boxShadow: mine
      ? '0 4px 12px rgba(13,177,173,0.25)'
      : '0 2px 8px rgba(13,42,42,0.05)',
  }),
  bubbleMeta: (mine) => ({
    opacity: mine ? 0.85 : 0.65,
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
    mb: 0.25,
  }),
  replyInput: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      background: '#fafcfc',
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: TEAL },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: TEAL,
        borderWidth: 2,
      },
    },
  },
  sendBtn: {
    mt: 1.5,
    alignSelf: 'flex-end',
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 2,
    px: 3,
    py: 1,
    background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DARK})`,
    boxShadow: '0 4px 14px rgba(13,177,173,0.30)',
    '&:hover': {
      background: `linear-gradient(135deg, ${TEAL_DARK}, #066a68)`,
      boxShadow: '0 8px 22px rgba(13,177,173,0.40)',
      transform: 'translateY(-1px)',
    },
    transition: 'all 0.25s ease',
  },
  // Appointments table
  tableHeadCell: {
    fontWeight: 700,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: MUTED,
    backgroundColor: '#f4fbfb',
    borderBottom: `2px solid rgba(13,177,173,0.15)`,
  },
  appointmentRow: {
    transition: 'background 0.2s',
    '&:hover': { background: '#f7fcfc' },
  },
  statusChip: (status) => {
    const isConfirmed = status === 'confirmed';
    const isCanceled = status === 'canceled';
    return {
      fontWeight: 700,
      fontSize: '0.72rem',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      borderRadius: 999,
      background: isConfirmed
        ? 'rgba(46, 160, 114, 0.14)'
        : isCanceled
        ? 'rgba(90, 107, 107, 0.12)'
        : 'rgba(255, 171, 64, 0.18)',
      color: isConfirmed
        ? '#1e7a54'
        : isCanceled
        ? MUTED
        : '#b96a00',
      border: 'none',
    };
  },
  // Empty states
  emptyState: {
    textAlign: 'center',
    py: 6,
    px: 3,
    borderRadius: 3,
    background: '#ffffff',
    border: '1px dashed rgba(13,177,173,0.28)',
  },
  emptyIcon: {
    fontSize: '3rem',
    mb: 1.5,
    opacity: 0.55,
  },
  primaryCta: {
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 2,
    px: 3,
    py: 1,
    background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DARK})`,
    boxShadow: '0 4px 14px rgba(13,177,173,0.30)',
    '&:hover': {
      background: `linear-gradient(135deg, ${TEAL_DARK}, #066a68)`,
      boxShadow: '0 8px 22px rgba(13,177,173,0.40)',
      transform: 'translateY(-1px)',
    },
    transition: 'all 0.25s ease',
  },
  // Account panel
  accountCard: {
    p: { xs: 3, md: 4 },
    borderRadius: 3,
    background: '#ffffff',
    border: '1px solid rgba(13,177,173,0.10)',
    boxShadow: '0 4px 20px rgba(13,42,42,0.06)',
  },
  dangerZone: {
    mt: 3,
    p: 3,
    borderRadius: 3,
    background: 'linear-gradient(135deg, #fff5f3 0%, #ffeceb 100%)',
    border: '1px solid rgba(255,123,107,0.30)',
  },
  dangerTitle: {
    fontWeight: 700,
    color: '#b44232',
    fontSize: '1rem',
    mb: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  deleteBtn: {
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 2,
    px: 3,
    borderColor: CORAL,
    color: '#b44232',
    '&:hover': {
      borderColor: '#b44232',
      background: 'rgba(255,123,107,0.08)',
    },
  },
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: 3,
      boxShadow: '0 20px 48px rgba(13,42,42,0.18)',
    },
  },
  badge: {
    ml: 1,
    fontWeight: 700,
    background: CORAL,
    color: '#ffffff',
    '& .MuiChip-label': { px: 1 },
  },
};

export default styles;
