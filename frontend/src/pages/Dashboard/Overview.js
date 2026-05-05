// src/pages/Dashboard/Overview.js
import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Alert, Button, Paper, Stack, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined';
import EventAvailableOutlined from '@mui/icons-material/EventAvailableOutlined';
import RateReviewOutlined from '@mui/icons-material/RateReviewOutlined';
import MarkEmailUnreadOutlined from '@mui/icons-material/MarkEmailUnreadOutlined';
import { fetchDashboardOverview } from '../../services/api';
import dashStyles from './dashboard.styles';

export default function Overview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    appointments: 0,
    testimonialsPending: 0,
    messagesUnread: 0,
    recentAppointments: [],
    recentUnreadThreads: [],
    pendingTestimonials: [],
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
    { label: 'Total Users', value: stats.users, icon: PeopleAltOutlined, variant: 'teal', to: '/dashboard/users' },
    { label: 'Appointments', value: stats.appointments, icon: EventAvailableOutlined, variant: 'coral', to: '/dashboard/appointments' },
    { label: 'Pending Testimonials', value: stats.testimonialsPending, icon: RateReviewOutlined, variant: 'amber', to: '/dashboard/testimonials' },
    { label: 'Unread Messages', value: stats.messagesUnread, icon: MarkEmailUnreadOutlined, variant: 'violet', to: '/dashboard/messages' },
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

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {cards.map(({ label, value, icon: Icon, variant, to }) => {
          const v = dashStyles.statVariants[variant];
          return (
            <Grid item xs={12} sm={6} md={3} key={label}>
              <Box
                role="button"
                tabIndex={0}
                onClick={() => navigate(to)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') navigate(to);
                }}
                sx={{
                  ...dashStyles.statCardBase,
                  border: v.tintBorder,
                  cursor: 'pointer',
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

      <Paper elevation={0} sx={{ ...dashStyles.card, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ sm: 'center' }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: dashStyles.colors.ink }}>
              Quick actions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Jump directly to the most common admin tasks.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button variant="contained" onClick={() => navigate('/dashboard/messages')} sx={dashStyles.primaryBtn}>Open inbox</Button>
            <Button variant="outlined" onClick={() => navigate('/dashboard/appointments')} sx={dashStyles.outlineBtn}>Manage appointments</Button>
            <Button variant="outlined" onClick={() => navigate('/dashboard/testimonials')} sx={dashStyles.outlineBtn}>Review testimonials</Button>
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={dashStyles.card}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography sx={{ fontWeight: 700, color: dashStyles.colors.ink }}>
                Upcoming appointments
              </Typography>
              <Button size="small" onClick={() => navigate('/dashboard/appointments')}>View all</Button>
            </Stack>
            {stats.recentAppointments?.length ? (
              <Stack spacing={1.2}>
                {stats.recentAppointments.map((a) => (
                  <Box key={a.id} sx={{ p: 1.4, borderRadius: 2, background: '#f8fcfc', border: '1px solid rgba(13,177,173,0.12)' }}>
                    <Typography sx={{ fontWeight: 600, color: '#0f2a2a' }}>
                      {a.patientName} · {new Date(a.appointmentDate).toLocaleString()}
                    </Typography>
                    <Chip size="small" label={a.status} sx={{ mt: 0.8, textTransform: 'capitalize' }} />
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">No appointments yet.</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={dashStyles.card}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography sx={{ fontWeight: 700, color: dashStyles.colors.ink }}>
                Unread message threads
              </Typography>
              <Button size="small" onClick={() => navigate('/dashboard/messages')}>Open inbox</Button>
            </Stack>
            {stats.recentUnreadThreads?.length ? (
              <Stack spacing={1.2}>
                {stats.recentUnreadThreads.map((t) => (
                  <Box key={t.threadId} sx={{ p: 1.4, borderRadius: 2, background: '#f8fcfc', border: '1px solid rgba(13,177,173,0.12)' }}>
                    <Typography sx={{ fontWeight: 600, color: '#0f2a2a' }}>
                      {t.name || t.email || 'Unknown'} · {new Date(t.lastAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {(t.lastPreview || '').slice(0, 80)}
                    </Typography>
                    <Chip size="small" label={`${t.unreadCount} unread`} sx={{ mt: 0.8 }} />
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">No unread threads right now.</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={0} sx={dashStyles.card}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography sx={{ fontWeight: 700, color: dashStyles.colors.ink }}>
                Pending testimonials
              </Typography>
              <Button size="small" onClick={() => navigate('/dashboard/testimonials')}>Moderate</Button>
            </Stack>
            {stats.pendingTestimonials?.length ? (
              <Stack spacing={1.2}>
                {stats.pendingTestimonials.map((t) => (
                  <Box key={t.id} sx={{ p: 1.4, borderRadius: 2, background: '#fffaf4', border: '1px solid rgba(244,167,59,0.25)' }}>
                    <Typography sx={{ fontWeight: 600, color: '#0f2a2a' }}>
                      {t.authorName} · {new Date(t.createdAt).toLocaleDateString()} · {t.rating}/5
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                      {(t.text || '').slice(0, 180)}{(t.text || '').length > 180 ? '…' : ''}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">No pending testimonials.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
