import React from 'react';
import { Box } from '@mui/material';
import DashboardSidebar from './DashboardSidebar';
import DashboardContent from './DashboardContent';
import dashStyles from './dashboard.styles';

export default function Dashboard() {
  return (
    <Box sx={dashStyles.shell}>
      <DashboardSidebar />
      <Box component="main" sx={dashStyles.main}>
        <DashboardContent />
      </Box>
    </Box>
  );
}
