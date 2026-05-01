// src/pages/Dashboard/Overview.js
import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Alert } from '@mui/material';
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined';
import EventAvailableOutlined from '@mui/icons-material/EventAvailableOutlined';
import RateReviewOutlined from '@mui/icons-material/RateReviewOutlined';
import MarkEmailUnreadOutlined from '@mui/icons-material/MarkEmailUnreadOutlined';
import { fetchDashboardOverview } from '../../services/api';
import dashStyles from './dashboard.styles';

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
    { label: 'Total Users', value: stats.users, icon: PeopleAltOutlined, variant: 'teal' },
    { label: 'Appointments', value: stats.appointments, icon: EventAvailableOutlined, variant: 'coral' },
    { label: 'Pending Testimonials', value: stats.testimonialsPending, icon: RateReviewOutlined, variant: 'amber' },
    { label: 'Unread Messages', value: stats.messagesUnread, icon: MarkEmailUnreadOutlined, variant: 'violet' },
  ];

  return (
    <Box>
      <Box sx={dashStyles.pageHeader}>
        <Box>
          <Typography component="h1" sx={dashStyles.pageTitle}>
            Dashboard Overview
          </Typography>
          <Typography sx={dashStyles.pageSubtitle}>
            Snapshot of your clinic's activity at a glance.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ ...dashStyles.alert }}>
          {error}. Check that the backend is running and you are logged in as admin.
        </Alert>
      )}

      <Grid container spacing={3}>
        {cards.map(({ label, value, icon: Icon, variant }) => {
          const v = dashStyles.statVariants[variant];
          return (
            <Grid item xs={12} sm={6} md={3} key={label}>
              <Box
                sx={{
                  ...dashStyles.statCardBase,
                  border: v.tintBorder,
                }}
              >
                <Box sx={{ ...dashStyles.statIconWrap, background: v.iconBg }}>
                  <Icon sx={{ fontSize: 28 }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={dashStyles.statLabel}>{label}</Typography>
                  <Typography sx={dashStyles.statValue}>{value}</Typography>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
