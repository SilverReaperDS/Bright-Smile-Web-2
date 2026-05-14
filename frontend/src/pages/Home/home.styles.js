// src/pages/Home/home.styles.js
const styles = {
  container: {
    py: 6,
  },
  heroSection: {
    textAlign: 'center',
    py: 6,
    px: 2,
    background: 'linear-gradient(90deg,#e6fffd,#f7fffe)',
    borderRadius: 2,
    mb: 5,
  },
  heroTitle: {
    mb: 1,
    fontWeight: 600,
  },
  heroSubtitle: {
    mb: 3,
  },
  heroButton: {
    backgroundColor: '#0db1ad',
    color: 'white',
    px: 3,
    py: 1.5,
    borderRadius: '6px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#178e8b',
    },
  },
  servicesSection: {
    mb: 6,
  },
  sectionHeading: {
    mb: 3,
    fontWeight: 500,
  },
  serviceLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    transition: 'transform 0.2s ease',
    '&:hover .service-card': {
      transform: 'translateY(-4px)',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
    },
  },
  serviceCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    border: '1px solid #eee',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  testimonialsSection: {
    mt: 10,
  },
};

export default styles;