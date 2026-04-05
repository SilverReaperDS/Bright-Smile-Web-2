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
} from '@mui/material';
import { fetchAdminTestimonials, patchAdminTestimonial } from '../../services/api';

export default function Testimonials() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await fetchAdminTestimonials();
      setRows(data);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (id) => {
    try {
      await patchAdminTestimonial(id, { status: 'approved' });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const unapprove = async (id) => {
    try {
      await patchAdminTestimonial(id, { status: 'pending' });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) {
    return <Typography>Loading testimonials…</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Testimonials
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
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
                <Typography color="text.secondary">No testimonials in database.</Typography>
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
                <Chip size="small" label={t.status} color={t.status === 'approved' ? 'success' : 'warning'} />
              </TableCell>
              <TableCell align="right">
                {t.status === 'pending' ? (
                  <Button size="small" variant="contained" onClick={() => approve(t.id)}>
                    Approve
                  </Button>
                ) : (
                  <Button size="small" onClick={() => unapprove(t.id)}>
                    Set pending
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
