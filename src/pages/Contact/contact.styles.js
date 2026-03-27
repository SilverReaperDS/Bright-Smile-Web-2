// src/pages/Contact/contact.styles.js
const styles = {
  root: {
    py: 6,
    backgroundColor: '#fff',
  },
  header: {
    textAlign: 'center',
    mb: 4,
  },
  title: {
    fontWeight: 600,
    color: '#0db1ad',
  },
  subtitle: {
    mt: 1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    mt: 2,
  },
  button: {
    backgroundColor: '#0db1ad',
    color: 'white',
    px: 4,
    py: 1.5,
    borderRadius: '6px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#178e8b',
    },
  },
};

export default styles;