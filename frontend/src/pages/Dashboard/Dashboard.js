import React from 'react';
import { Box } from '@mui/material';
import DashboardSidebar from './DashboardSidebar';
import DashboardContent from './DashboardContent';

export default function Dashboard() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <DashboardSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <DashboardContent />
      </Box>
    </Box>
  );
}