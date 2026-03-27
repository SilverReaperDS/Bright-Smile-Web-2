// src/pages/Register/register.styles.js
const styles = {
  root: {
    minHeight: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    mt: '187px',
    mb: '187px',
    background: 'linear-gradient(135deg, #e6f7f9, #d0f0f4)',
    fontFamily: `'Segoe UI', sans-serif`,
  },
  paper: {
    p: '2.5rem 2rem',
    borderRadius: '12px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    mb: '1.5rem',
    fontSize: '1.8rem',
    color: '#00796b',
    fontWeight: 600,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    width: '100%',
  },
  input: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
    },
    '& .MuiOutlinedInput-input': {
      padding: '0.75rem 1rem',
    },
  },
  error: {
    color: '#d32f2f',
    fontSize: '0.9rem',
    textAlign: 'center',
    mt: '0.5rem',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#26a69a',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: '8px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#00796b',
    },
  },
  loginText: {
    mt: '1rem',
    fontSize: '0.95rem',
    textAlign: 'center',
  },
  loginLink: {
    color: '#00796b',
    fontWeight: 500,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};

export default styles;