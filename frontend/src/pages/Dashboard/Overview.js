// src/pages/Dashboard/Overview.js
import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Alert } from '@mui/material';
import { fetchDashboardOverview } from '../../services/api';

export default function Overview() {
  const [stats, setStats] = useState({
    users: 0,
    appointments: 0,
    testimonialsPending: 0,
    messagesUnread: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardOverview()
      .then((data) => {
        setStats(data);
        setError('');
      })
      .catch((err) => {
        setError(err.message || 'Could not load overview');
      });
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.users },
    { label: 'Appointments', value: stats.appointments },
    { label: 'Pending Testimonials', value: stats.testimonialsPending },
    { label: 'Unread Messages', value: stats.messagesUnread },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}. Check that the backend is running and you are logged in as admin.
        </Alert>
      )}
      <Grid container spacing={3}>
        {cards.map(({ label, value }) => (
          <Grid item xs={12} sm={6} md={3} key={label}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">{label}</Typography>
              <Typography variant="h4" color="primary">
                {value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
