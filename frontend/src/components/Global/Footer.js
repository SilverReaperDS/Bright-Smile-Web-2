// src/components/Footer/Footer.js
import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import styles from './footer.styles';

export default function Footer() {
  return (
    <Box component="footer" sx={styles.footer}>
      <Container maxWidth="md" sx={styles.container}>
        <Typography variant="body2" color="text.primary">
          © 2026 BrightSmile Dental Clinic
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={styles.credit}>
          Built by: Saed Aghbar (12429711), Ayoub Aghbar (12428124), Eyas Marshoud (12428791), Nsralla Dabeek (12428610), Khalid Saqir (12326115)
        </Typography>
      </Container>
    </Box>
  );
}