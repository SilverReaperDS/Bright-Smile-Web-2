import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { getMe } from '../services/api';

export default function PrivateRoute({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    getMe()
      .then(() => {
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
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
