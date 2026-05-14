import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NotFound({ title = 'Page not found', message = "The page you requested doesn't exist." }) {
  return (
    <Box
      sx={{
        maxWidth: 680,
        mx: 'auto',
        my: { xs: 4, md: 8 },
        p: { xs: 3, md: 5 },
        borderRadius: 4,
        border: '1px solid rgba(13,177,173,0.2)',
        background: 'linear-gradient(180deg, #ffffff 0%, #f3fcfb 100%)',
        textAlign: 'center',
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '3rem', md: '4rem' },
          lineHeight: 1,
          fontWeight: 800,
          background: 'linear-gradient(135deg, #0db1ad, #ff7b6b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1.2,
        }}
      >
        404
      </Typography>
      <Typography component="h1" variant="h5" sx={{ fontWeight: 700, color: '#0f2a2a', mb: 1 }}>
        {title}
      </Typography>
      <Typography sx={{ color: '#5a6b6b', mb: 3 }}>
        {message}
      </Typography>
      <Button component={Link} to="/" variant="contained" sx={{ textTransform: 'none', borderRadius: 2.5, px: 3 }}>
        Back to home
      </Button>
    </Box>
  );
}
