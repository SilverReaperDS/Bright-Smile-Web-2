// src/pages/SmileGallery.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import GalleryViewer from '../../components/Gallery/GalleryViewer';
import styles from './smileGallery.styles';

export default function SmileGallery() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/gallery.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load gallery');
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={styles.section}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" sx={styles.heading}>
          Smile Gallery
        </Typography>

        {loading && (
          <Box sx={styles.loading}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={styles.errorBox}>
            {error}
          </Alert>
        )}

        {!loading && !error && <GalleryViewer items={data} />}
      </Container>
    </Box>
  );
}