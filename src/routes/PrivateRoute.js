import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getMe } from '../services/api';

export default function PrivateRoute({ children }) {
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
    return null;
  }

  if (status === 'denied') {
    return <Navigate to="/login" replace />;
  }

  return children;
}
