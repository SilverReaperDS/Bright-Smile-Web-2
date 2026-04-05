// src/components/Testimonials/TestimonialCard.js
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import styles from './testimonialCard.styles';

export default function TestimonialCard({ name, rating, text, date }) {
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
          {'★'.repeat(rating) + '☆'.repeat(5 - rating)}
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