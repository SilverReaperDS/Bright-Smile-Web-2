// src/components/Testimonials/TestimonialCard.js
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import styles from './testimonialCard.styles';

export default function TestimonialCard({ name, rating, text, date }) {
  const n = Number(rating);
  const stars = Number.isFinite(n) && n >= 1 && n <= 5 ? n : 5;
  return (
    <Card
      role="article"
      aria-label={`Testimonial by ${name}`}
      sx={styles.card}
    >
      <CardContent>
        <Typography variant="h6" component="h4" gutterBottom>
          {name}
        </Typography>

        <Box sx={styles.stars} aria-hidden>
          {'★'.repeat(stars) + '☆'.repeat(5 - stars)}
        </Box>

        <Typography variant="body2" sx={styles.text}>
          {text}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {date}
        </Typography>
      </CardContent>
    </Card>
  );
}