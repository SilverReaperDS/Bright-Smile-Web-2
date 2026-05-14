// src/pages/SmileGallery/SmileGallery.js
import React, { useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import GalleryViewer from '../../components/Gallery/GalleryViewer';
import useFetch from '../../hooks/useFetch';
import { getGallery } from '../../services/api';
import styles from './smileGallery.styles';

export default function SmileGallery() {
  const fetcher = useCallback((opts) => getGallery(opts), []);
  const { data, loading, error, refetch } = useFetch(fetcher, [fetcher]);

  return (
    <Box sx={styles.section}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={styles.headerWrap}>
          <Box component="span" sx={styles.eyebrow}>
            Real Patients · Real Results
          </Box>
          <Typography variant="h4" component="h1" sx={styles.heading}>
            Smile Gallery
          </Typography>
          <Typography sx={styles.subheading}>
            Explore genuine before-and-after transformations from our patients.
            Every smile tells a story of care, craftsmanship, and confidence.
          </Typography>
        </Box>

        {loading && (
          <Box sx={styles.loading}>
            <CircularProgress color="inherit" />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Loading smile transformations…
            </Typography>
          </Box>
        )}

        {error && (
          <Alert
            severity="error"
            sx={styles.errorBox}
            action={
              <Button color="inherit" size="small" onClick={refetch}>
                Retry
              </Button>
            }
          >
            {error.message || String(error)}
          </Alert>
        )}

        {!loading && !error && data?.length > 0 && <GalleryViewer cases={data} />}
        {!loading && !error && (!data || data.length === 0) && (
          <Box sx={styles.emptyState}>
            <Box sx={styles.emptyIcon}>🦷</Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f2a2a', mb: 1 }}>
              No cases yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Our smile gallery is being curated. Check back soon to see
              inspiring transformations.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
