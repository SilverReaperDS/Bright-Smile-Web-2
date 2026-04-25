// src/components/Home/carousel.styles.js

const styles = {
  root: {
    position: 'relative',
    width: '100%',
    maxWidth: 'none',
    my: { xs: 3, md: 5 },
    px: 0,
  },

  viewport: {
    position: 'relative',
    overflow: 'visible',
    borderRadius: 0,
    background: 'transparent',
    padding: 0,
    boxShadow: 'none',
  },

  viewportInner: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 0,
    background: 'transparent',
  },

  track: (length) => ({
    display: 'flex',
    transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
    width: '100%',
    willChange: 'transform',
  }),

  slide: {
    flex: '0 0 100%',
    boxSizing: 'border-box',
    flexShrink: 0,
    padding: 0,
    display: 'block',
  },

  arrow: {
    position: 'absolute',
    top: 'auto',
    bottom: { xs: -54, sm: -58 },
    zIndex: 3,
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.92)',
    color: '#0a938f',
    boxShadow: '0 8px 20px rgba(8, 38, 38, 0.18)',
    backdropFilter: 'blur(6px)',
    transition:
      'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), background-color 220ms ease, color 220ms ease',
    '&:hover': {
      backgroundColor: '#0db1ad',
      color: '#ffffff',
      transform: 'scale(1.08)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: '0 0 0 4px rgba(13,177,173,0.3)',
    },
  },

  arrowLeft: {
    left: '50%',
    transform: 'translateX(calc(-100% - 10px))',
    '&:hover': { transform: 'translateX(calc(-100% - 10px)) scale(1.08)' },
  },
  arrowRight: {
    left: '50%',
    transform: 'translateX(10px)',
    '&:hover': { transform: 'translateX(10px) scale(1.08)' },
  },

  controls: {
    mt: { xs: 8, sm: 8.5 },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
  },

  dot: (active) => ({
    width: active ? 28 : 10,
    height: 10,
    borderRadius: 999,
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    background: active
      ? 'linear-gradient(135deg, #0db1ad 0%, #2ec6c2 100%)'
      : 'rgba(13, 177, 173, 0.25)',
    transition:
      'width 300ms cubic-bezier(0.22, 1, 0.36, 1), background 300ms ease, transform 200ms ease',
    '&:hover': {
      background: active
        ? 'linear-gradient(135deg, #0a938f 0%, #0db1ad 100%)'
        : 'rgba(13, 177, 173, 0.5)',
      transform: 'scale(1.15)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: '0 0 0 4px rgba(13,177,173,0.25)',
    },
  }),
};

export default styles;
