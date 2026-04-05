import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  IconButton,
  Paper,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { fetchAdminGallery, postAdminGalleryItem, deleteAdminGalleryItem } from '../../services/api';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await fetchAdminGallery();
      setItems(data);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await postAdminGalleryItem({
        title: title.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        description: description.trim() || undefined,
        category: category.trim() || undefined,
      });
      setTitle('');
      setImageUrl('');
      setDescription('');
      setCategory('');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await deleteAdminGalleryItem(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) {
    return <Typography>Loading gallery…</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gallery (database)
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Items here are served from the API. The public gallery page may still use static JSON until you point it at the API.
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }} component="form" onSubmit={handleAdd}>
        <Typography variant="subtitle1" gutterBottom>
          Add image
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 480 }}>
          <TextField label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required fullWidth />
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={2} />
          <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} fullWidth />
          <Button type="submit" variant="contained" disabled={saving || !imageUrl.trim()}>
            Add
          </Button>
        </Box>
      </Paper>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Preview</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>URL</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography color="text.secondary">No items in database.</Typography>
              </TableCell>
            </TableRow>
          )}
          {items.map((g) => (
            <TableRow key={g.id}>
              <TableCell>
                {g.imageUrl ? (
                  <Box
                    component="img"
                    src={g.imageUrl}
                    alt=""
                    sx={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 1 }}
                  />
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell>{g.title || '—'}</TableCell>
              <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.imageUrl || '—'}</TableCell>
              <TableCell align="right">
                <IconButton aria-label="delete" onClick={() => remove(g.id)} size="small" color="error">
                  <DeleteOutlineIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
