import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  IconButton,
  Paper,
  CircularProgress,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  fetchAdminTestimonials,
  patchAdminTestimonial,
  deleteAdminTestimonial,
} from '../../services/api';
import dashStyles from './dashboard.styles';

const STATUS_FILTER = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const RATING_FILTER = [
  { value: '', label: 'All ratings' },
  { value: '5', label: '5 stars' },
  { value: '4', label: '4 stars' },
  { value: '3', label: '3 stars' },
  { value: '2', label: '2 stars' },
  { value: '1', label: '1 star' },
];

function statusChipColor(status) {
  if (status === 'approved') return 'success';
  if (status === 'rejected') return 'error';
  return 'warning';
}

function renderStars(rating) {
  if (rating == null) return '—';
  const n = Math.max(0, Math.min(5, Number(rating) || 0));
  return (
    <Box component="span" sx={{ color: '#ff7b6b', letterSpacing: '0.08em', fontSize: '1rem' }}>
      {'★'.repeat(n)}
      <Box component="span" sx={{ color: 'rgba(15,42,42,0.15)' }}>
        {'★'.repeat(5 - n)}
      </Box>
    </Box>
  );
}

export default function Testimonials() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editAuthor, setEditAuthor] = useState('');
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState('5');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await fetchAdminTestimonials({
        status: statusFilter || undefined,
        rating: ratingFilter || undefined,
      });
      setRows(data);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, ratingFilter]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const openEdit = (t) => {
    setEditing(t);
    setEditAuthor(t.authorName || '');
    setEditText(t.text || '');
    setEditRating(String(t.rating ?? 5));
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editing) return;
    const r = parseInt(editRating, 10);
    setSaving(true);
    setError('');
    try {
      await patchAdminTestimonial(editing.id, {
        authorName: editAuthor.trim() || null,
        text: editText.trim(),
        rating: Number.isFinite(r) && r >= 1 && r <= 5 ? r : editing.rating,
      });
      setEditOpen(false);
      setEditing(null);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (id, status) => {
    setError('');
    try {
      await patchAdminTestimonial(id, { status });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this testimonial permanently?')) return;
    setError('');
    try {
      await deleteAdminTestimonial(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading && rows.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 3 }}>
        <CircularProgress size={28} sx={{ color: '#0db1ad' }} />
        <Typography sx={{ color: '#5a6b6b' }}>Loading testimonials…</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={dashStyles.pageHeader}>
        <Box>
          <Typography component="h1" sx={dashStyles.pageTitle}>
            Testimonials
          </Typography>
          <Typography sx={dashStyles.pageSubtitle}>
            Moderate submissions, edit copy, and filter by status or rating. Only approved items appear on the public site (
            <code>/api/testimonials</code>).
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
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="filter-status">Status</InputLabel>
            <Select
              labelId="filter-status"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUS_FILTER.map((o) => (
                <MenuItem key={o.value || 'all'} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="filter-rating">Rating</InputLabel>
            <Select
              labelId="filter-rating"
              label="Rating"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              {RATING_FILTER.map((o) => (
                <MenuItem key={o.value || 'all-r'} value={o.value}>
                  {o.label}
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
              <TableCell sx={dashStyles.tableHeaderCell}>Date</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Author</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Rating</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Text</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Status</TableCell>
              <TableCell align="right" sx={dashStyles.tableHeaderCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary">No testimonials match these filters.</Typography>
                </TableCell>
              </TableRow>
            )}
            {rows.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell>{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{t.authorName || '—'}</TableCell>
                <TableCell>{renderStars(t.rating)}</TableCell>
                <TableCell sx={{ maxWidth: 280, whiteSpace: 'pre-wrap' }}>{t.text}</TableCell>
                <TableCell>
                  <Chip size="small" label={t.status} color={statusChipColor(t.status)} />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
                    {t.status !== 'approved' && (
                      <Button size="small" variant="contained" color="success" onClick={() => setStatus(t.id, 'approved')} sx={{ textTransform: 'none' }}>
                        Approve
                      </Button>
                    )}
                    {t.status !== 'rejected' && (
                      <Button size="small" color="error" onClick={() => setStatus(t.id, 'rejected')} sx={{ textTransform: 'none' }}>
                        Reject
                      </Button>
                    )}
                    {t.status !== 'pending' && (
                      <Button size="small" onClick={() => setStatus(t.id, 'pending')} sx={{ textTransform: 'none' }}>
                        Pending
                      </Button>
                    )}
                    <IconButton size="small" aria-label="Edit" onClick={() => openEdit(t)}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" aria-label="Delete" color="error" onClick={() => remove(t.id)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={editOpen} onClose={() => !saving && setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit testimonial</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Author name"
            fullWidth
            value={editAuthor}
            onChange={(e) => setEditAuthor(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Rating"
            select
            fullWidth
            value={editRating}
            onChange={(e) => setEditRating(e.target.value)}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <MenuItem key={n} value={String(n)}>
                {n} stars
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            label="Text"
            fullWidth
            required
            multiline
            minRows={4}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={saveEdit} variant="contained" disabled={saving || !editText.trim()} sx={dashStyles.primaryBtn}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
