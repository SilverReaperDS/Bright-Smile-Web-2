// src/pages/Dashboard/Overview.js
import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';

export default function Overview() {
  const [stats, setStats] = useState({
    users: 0,
    appointments: 0,
    testimonialsPending: 0,
    messagesUnread: 0,
  });

  useEffect(() => {
    // Example: fetch stats from backend
    fetch('/api/dashboard/overview', {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {
        // fallback dummy data if backend not ready
        setStats({
          users: 120,
          appointments: 45,
          testimonialsPending: 6,
          messagesUnread: 10,
        });
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