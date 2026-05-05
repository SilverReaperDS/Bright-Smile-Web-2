import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { fetchAdminUserActivityLogs } from '../../services/api';
import dashStyles from './dashboard.styles';

export default function ActivityLogs() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await fetchAdminUserActivityLogs();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const actionOptions = useMemo(() => {
    const set = new Set(rows.map((r) => r.action).filter(Boolean));
    return Array.from(set).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    if (!actionFilter) return rows;
    return rows.filter((r) => r.action === actionFilter);
  }, [rows, actionFilter]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 3 }}>
        <CircularProgress size={28} sx={{ color: '#0db1ad' }} />
        <Typography sx={{ color: '#5a6b6b' }}>Loading activity logs…</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={dashStyles.pageHeader}>
        <Box>
          <Typography component="h1" sx={dashStyles.pageTitle}>
            User activity logs
          </Typography>
          <Typography sx={dashStyles.pageSubtitle}>
            Track account creation and important user actions like testimonials and admin changes.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={dashStyles.alert} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ ...dashStyles.card, p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="filter-action">Action</InputLabel>
            <Select
              labelId="filter-action"
              label="Action"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <MenuItem value="">All actions</MenuItem>
              {actionOptions.map((action) => (
                <MenuItem key={action} value={action}>
                  {action}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={dashStyles.card}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={dashStyles.tableHeaderCell}>When</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Action</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Actor</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Target user</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography color="text.secondary">No activity logs found.</Typography>
                </TableCell>
              </TableRow>
            )}
            {filtered.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                <TableCell>{row.action || '—'}</TableCell>
                <TableCell>{row.actor?.username || 'System'}</TableCell>
                <TableCell>{row.user?.username || '—'}</TableCell>
                <TableCell sx={{ whiteSpace: 'pre-wrap', maxWidth: 420 }}>{row.details || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
