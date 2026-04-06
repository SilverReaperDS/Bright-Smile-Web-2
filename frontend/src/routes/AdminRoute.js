import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { getMe } from '../services/api';

export default function AdminRoute({ children }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    getMe()
      .then((data) => {
        if (data.role !== 'admin') {
          setStatus('forbidden');
          return;
        }
        setStatus('ok');
      })
      .catch(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        setStatus('denied');
      });
  }, []);

  if (status === 'checking') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/login" replace />;
  }

  if (status === 'forbidden') {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Access denied
        </Typography>
        <Typography color="text.secondary">Only administrators can open the dashboard.</Typography>
      </Box>
    );
  }

  return children;
}
