import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
} from '@mui/material';
import ServiceCard from '../../components/Home/ServiceCard';
import TestimonialCard from '../../components/Home/TestimonialCard';
import Carousel from '../../components/Home/Carousel';

export default function Home() {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetch('/data/services.json')
      .then((r) => r.json())
      .then(setServices)
      .catch(() => setServices([]));

    fetch('/data/testimonials.json')
      .then((r) => r.json())
      .then(setTestimonials)
      .catch(() => setTestimonials([]));
  }, []);

  return (
    <Container sx={{ py: 6 }}>
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          px: 2,
          background: 'linear-gradient(90deg,#e6fffd,#f7fffe)',
          borderRadius: 2,
          mb: 5,
        }}
      >
        <Typography variant="h4" component="h2" sx={{ mb: 1, fontWeight: 600 }}>
          BrightSmile Dental Clinic
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Compassionate care. Modern treatments. Beautiful results.
        </Typography>
        <Button
          component={RouterLink}
          to="/contact"
          variant="contained"
          sx={{
            backgroundColor: '#0db1ad',
            color: 'white',
            px: 3,
            py: 1.5,
            borderRadius: '6px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#178e8b',
            },
          }}
        >
          Book Appointment
        </Button>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 500 }}>
          Our Services
        </Typography>
        <Grid container spacing={3}>
          {services.map((s) => (
            <Grid item key={s.id} xs={12} sm={6} md={4}>
              <Box
                component={RouterLink}
                to={`/services/${s.id}`}
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  transition: 'transform 0.2s ease',
                  '&:hover .service-card': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Box
                  className="service-card"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  <ServiceCard {...s} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box component="section" sx={{ mt: 6 }}>
        <Typography
          variant="h5"
          component="h3"
          sx={{ mb: 3, fontWeight: 500, mt: 4 }}
        >
          What Patients Say
        </Typography>
        <Carousel>
          {testimonials.slice(0, 5).map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}
        </Carousel>
      </Box>
    </Container>
  );
}