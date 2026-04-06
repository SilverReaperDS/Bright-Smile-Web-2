import React from 'react';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const links = [
  { label: 'Overview', path: '/dashboard' },
  { label: 'Messages', path: '/dashboard/messages' },
  { label: 'Testimonials', path: '/dashboard/testimonials' },
  { label: 'Gallery', path: '/dashboard/gallery' },
  { label: 'Appointments', path: '/dashboard/appointments' },
  { label: 'Users & staff', path: '/dashboard/users' },
];

export default function DashboardSidebar() {
  return (
    <Box sx={{ width: 240, borderRight: '1px solid #ddd', height: '100vh', p: 2 }}>
      <List>
        {links.map(({ label, path }) => (
          <ListItem button key={path} component={Link} to={path}>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}