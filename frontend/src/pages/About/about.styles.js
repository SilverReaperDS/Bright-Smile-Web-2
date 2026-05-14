// src/pages/About/about.styles.js
const styles = {
  container: {
    py: 6,
  },
  heading: {
    fontWeight: 600,
    color: '#0db1ad',
    mb: 2,
  },
  description: {
    maxWidth: 800,
    mb: 5,
  },
  teamSection: {
    mt: 4,
  },
  teamHeading: {
    mb: 3,
    fontWeight: 500,
    color: '#00796b',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    mt: 4,
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    gap: '24px',
    mb: '32px',
    border: '1px solid #eee',
    borderRadius: '8px',
    p: '16px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
    '&:hover': {
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
      transform: 'translateY(-4px)',
    },
  },
  photo: {
    width: '160px',
    height: '160px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  name: {
    mb: '4px',
    fontSize: '20px',
    color: '#0db1ad',
  },
  role: {
    fontWeight: 'bold',
    mb: '8px',
  },
  bio: {
    mb: '8px',
    lineHeight: 1.6,
  },
  id: {
    fontSize: '14px',
    color: '#555',
  },
};

export default styles;