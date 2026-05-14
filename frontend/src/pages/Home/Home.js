import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getTestimonials } from '../../services/api';
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

    const ac = new AbortController();
    getTestimonials({ signal: ac.signal })
      .then(setTestimonials)
      .catch(() => {
        if (ac.signal.aborted) return;
        setTestimonials([]);
      });
    return () => ac.abort();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, md: 4 } }}>
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
          to="/book-appointment"
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #0db1ad 0%, #0a8f8c 100%)',
            color: 'white',
            fontWeight: 800,
            px: 3.25,
            py: 1.35,
            borderRadius: '14px',
            textTransform: 'none',
            boxShadow: '0 18px 40px -24px rgba(8, 38, 38, 0.55)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0a8f8c 0%, #0db1ad 100%)',
              boxShadow: '0 22px 50px -30px rgba(8, 38, 38, 0.65)',
            },
          }}
        >
          Book Appointment
        </Button>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          component="h3"
          sx={{ mb: 3, fontWeight: 500, textAlign: 'center' }}
        >
          Our Services
        </Typography>
        <Box sx={{ maxWidth: 1500, mx: 'auto', width: '100%' }}>
          <Grid
            container
            spacing={3}
            alignItems="stretch"
            justifyContent="center"
          >
            {services.map((s) => (
              <Grid
                item
                key={s.id}
                xs={12}
                sm="auto"
                sx={{
                  display: 'flex',
                  width: { xs: '100%', sm: 450 },
                  maxWidth: '100%',
                }}
              >
                <ServiceCard {...s} />
              </Grid>
            ))}
          </Grid>
        </Box>
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