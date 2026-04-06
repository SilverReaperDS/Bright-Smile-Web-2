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
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  fetchAdminTestimonials,
  patchAdminTestimonial,
  deleteAdminTestimonial,
} from '../../services/api';

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
    return <Typography>Loading testimonials…</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Testimonials
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Moderate submissions, edit copy, and filter by status or rating. Only approved items appear on the public site (
        <code>/api/testimonials</code>).
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
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

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Text</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
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
            <TableRow key={t.id}>
              <TableCell>{new Date(t.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{t.authorName || '—'}</TableCell>
              <TableCell>{t.rating ?? '—'}</TableCell>
              <TableCell sx={{ maxWidth: 280, whiteSpace: 'pre-wrap' }}>{t.text}</TableCell>
              <TableCell>
                <Chip size="small" label={t.status} color={statusChipColor(t.status)} />
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.5} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
                  {t.status !== 'approved' && (
                    <Button size="small" variant="contained" color="success" onClick={() => setStatus(t.id, 'approved')}>
                      Approve
                    </Button>
                  )}
                  {t.status !== 'rejected' && (
                    <Button size="small" color="error" onClick={() => setStatus(t.id, 'rejected')}>
                      Reject
                    </Button>
                  )}
                  {t.status !== 'pending' && (
                    <Button size="small" onClick={() => setStatus(t.id, 'pending')}>
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
          <Button onClick={saveEdit} variant="contained" disabled={saving || !editText.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
