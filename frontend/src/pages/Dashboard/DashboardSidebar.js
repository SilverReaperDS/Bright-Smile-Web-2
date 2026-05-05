import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import MailOutlineOutlined from '@mui/icons-material/MailOutlineOutlined';
import StarBorderOutlined from '@mui/icons-material/StarBorderOutlined';
import PhotoLibraryOutlined from '@mui/icons-material/PhotoLibraryOutlined';
import EventAvailableOutlined from '@mui/icons-material/EventAvailableOutlined';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import HistoryEduOutlined from '@mui/icons-material/HistoryEduOutlined';

const links = [
  { label: 'Overview', path: '/dashboard', icon: DashboardOutlined },
  { label: 'Messages', path: '/dashboard/messages', icon: MailOutlineOutlined },
  { label: 'Testimonials', path: '/dashboard/testimonials', icon: StarBorderOutlined },
  { label: 'Gallery', path: '/dashboard/gallery', icon: PhotoLibraryOutlined },
  { label: 'Appointments', path: '/dashboard/appointments', icon: EventAvailableOutlined },
  { label: 'Users & staff', path: '/dashboard/users', icon: PeopleOutlined },
  { label: 'Activity logs', path: '/dashboard/activity-logs', icon: HistoryEduOutlined },
];

function isActivePath(currentPath, linkPath) {
  if (linkPath === '/dashboard') {
    return currentPath === '/dashboard' || currentPath === '/dashboard/';
  }
  return currentPath === linkPath || currentPath.startsWith(`${linkPath}/`);
}

export default function DashboardSidebar() {
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 260,
        flexShrink: 0,
        background: '#ffffff',
        borderRight: '1px solid rgba(13,177,173,0.12)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        p: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Brand header */}
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #0db1ad, #088a87)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.1rem',
              boxShadow: '0 6px 14px rgba(13,177,173,0.3)',
            }}
          >
            BS
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                color: '#0f2a2a',
                letterSpacing: '-0.01em',
                lineHeight: 1.1,
                fontSize: '1.05rem',
              }}
            >
              Bright Smile
            </Typography>
            <Chip
              label="ADMIN"
              size="small"
              sx={{
                mt: 0.5,
                height: 18,
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#fff',
                background: 'linear-gradient(135deg, #0db1ad, #088a87)',
                '& .MuiChip-label': { px: 1 },
              }}
            />
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(13,177,173,0.10)' }} />

      {/* Nav */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1.5 }}>
        <List disablePadding>
          {links.map(({ label, path, icon: Icon }) => {
            const active = isActivePath(location.pathname, path);
            return (
              <ListItemButton
                key={path}
                component={Link}
                to={path}
                selected={active}
                sx={{
                  mx: 1.5,
                  my: 0.25,
                  borderRadius: 2,
                  py: 1,
                  pl: 1.5,
                  borderLeft: active ? '4px solid #0db1ad' : '4px solid transparent',
                  backgroundColor: active ? '#e6faf9' : 'transparent',
                  color: '#0f2a2a',
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    backgroundColor: '#e6faf9',
                    '&:hover': { backgroundColor: '#d4f4f2' },
                  },
                  '&:hover': {
                    backgroundColor: active ? '#d4f4f2' : 'rgba(13,177,173,0.06)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: active ? '#088a87' : '#5a6b6b',
                  }}
                >
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: '0.92rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#0f2a2a' : '#0f2a2a',
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ px: 3, py: 2, borderTop: '1px solid rgba(13,177,173,0.10)' }}>
        <Typography
          variant="caption"
          sx={{
            color: '#5a6b6b',
            letterSpacing: '0.05em',
            fontSize: '0.72rem',
          }}
        >
          v1.0 · Admin Panel
        </Typography>
      </Box>
    </Box>
  );
}
