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
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No smile cases to show yet.
          </Typography>
        )}
      </Container>
    </Box>
  );
}