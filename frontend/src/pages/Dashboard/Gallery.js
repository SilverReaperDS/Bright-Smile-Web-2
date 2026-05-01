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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import {
  fetchAdminGallery,
  postAdminGalleryCase,
  postAdminGalleryCaseFromUrls,
  deleteAdminGalleryItem,
  patchAdminGalleryCase,
  patchAdminGalleryReorder,
} from '../../services/api';
import dashStyles from './dashboard.styles';

function FilePick({ label, file, onChange, inputKey }) {
  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600, color: '#0f2a2a' }}>
        {label}
      </Typography>
      <Button
        variant="outlined"
        component="label"
        size="small"
        startIcon={<CloudUploadOutlinedIcon />}
        sx={{
          ...dashStyles.outlineBtn,
          px: 2,
        }}
      >
        {file ? 'Change file' : 'Choose image…'}
        <input key={inputKey} type="file" accept="image/jpeg,image/png,image/gif,image/webp" hidden onChange={onChange} />
      </Button>
      {file && (
        <Box sx={{ mt: 1 }}>
          <Chip
            size="small"
            label={file.name}
            sx={{
              backgroundColor: '#e6faf9',
              color: '#088a87',
              fontWeight: 600,
              maxWidth: 220,
              '& .MuiChip-label': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default function Gallery() {
  const [cases, setCases] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [urlBefore, setUrlBefore] = useState('');
  const [urlAfter, setUrlAfter] = useState('');
  const [saving, setSaving] = useState(false);
  const [fileKey, setFileKey] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editBeforeUrl, setEditBeforeUrl] = useState('');
  const [editAfterUrl, setEditAfterUrl] = useState('');
  const [editBeforeFile, setEditBeforeFile] = useState(null);
  const [editAfterFile, setEditAfterFile] = useState(null);
  const [editFileKey, setEditFileKey] = useState(0);

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await fetchAdminGallery();
      setCases(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const persistOrder = async (next) => {
    await patchAdminGalleryReorder(next.map((x) => x.id));
  };

  const moveItem = async (index, delta) => {
    const j = index + delta;
    if (j < 0 || j >= cases.length) return;
    const next = [...cases];
    [next[index], next[j]] = [next[j], next[index]];
    setError('');
    try {
      await persistOrder(next);
      setCases(next);
    } catch (e) {
      setError(e.message);
      load();
    }
  };

  const handleAddPair = async (e) => {
    e.preventDefault();
    setError('');
    const uB = urlBefore.trim();
    const uA = urlAfter.trim();
    if (beforeFile && afterFile) {
      setSaving(true);
      try {
        const fd = new FormData();
        if (title.trim()) fd.append('title', title.trim());
        if (description.trim()) fd.append('description', description.trim());
        if (category.trim()) fd.append('category', category.trim());
        fd.append('beforeImage', beforeFile);
        fd.append('afterImage', afterFile);
        await postAdminGalleryCase(fd);
        setTitle('');
        setDescription('');
        setCategory('');
        setBeforeFile(null);
        setAfterFile(null);
        setUrlBefore('');
        setUrlAfter('');
        setFileKey((k) => k + 1);
        await load();
      } catch (err) {
        setError(err.message);
      } finally {
        setSaving(false);
      }
      return;
    }
    if (uB && uA) {
      setSaving(true);
      try {
        await postAdminGalleryCaseFromUrls({
          beforeImageUrl: uB,
          afterImageUrl: uA,
          title: title.trim() || undefined,
          description: description.trim() || undefined,
          category: category.trim() || undefined,
        });
        setTitle('');
        setDescription('');
        setCategory('');
        setUrlBefore('');
        setUrlAfter('');
        await load();
      } catch (err) {
        setError(err.message);
      } finally {
        setSaving(false);
      }
      return;
    }
    setError('Add exactly one pair: either two image files (before + after) or both image URLs.');
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this before/after case? Uploaded files will be removed from the server.')) return;
    try {
      await deleteAdminGalleryItem(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const openEdit = (row) => {
    setEditing(row);
    setEditTitle(row.title || '');
    setEditDescription(row.description || '');
    setEditCategory(row.category || '');
    setEditBeforeUrl(row.beforeImageUrl || '');
    setEditAfterUrl(row.afterImageUrl || '');
    setEditBeforeFile(null);
    setEditAfterFile(null);
    setEditFileKey((k) => k + 1);
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    setError('');
    try {
      if (!editBeforeFile && !editAfterFile) {
        await patchAdminGalleryCase(editing.id, {
          title: editTitle.trim() || null,
          description: editDescription.trim() || null,
          category: editCategory.trim() || null,
          beforeImageUrl: editBeforeUrl.trim(),
          afterImageUrl: editAfterUrl.trim(),
        });
      } else {
        const fd = new FormData();
        fd.append('title', editTitle.trim());
        fd.append('description', editDescription.trim());
        fd.append('category', editCategory.trim());
        if (editBeforeFile) fd.append('beforeImage', editBeforeFile);
        else fd.append('beforeImageUrl', editBeforeUrl.trim() || editing.beforeImageUrl || '');
        if (editAfterFile) fd.append('afterImage', editAfterFile);
        else fd.append('afterImageUrl', editAfterUrl.trim() || editing.afterImageUrl || '');
        await patchAdminGalleryCase(editing.id, fd);
      }
      setEditOpen(false);
      setEditing(null);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const canSubmitPair = (beforeFile && afterFile) || (urlBefore.trim() && urlAfter.trim());

  if (loading && cases.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 3 }}>
        <CircularProgress size={28} sx={{ color: '#0db1ad' }} />
        <Typography sx={{ color: '#5a6b6b' }}>Loading gallery…</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={dashStyles.pageHeader}>
        <Box>
          <Typography component="h1" sx={dashStyles.pageTitle}>
            Smile Gallery
          </Typography>
          <Typography sx={dashStyles.pageSubtitle}>
            Each entry is one case: exactly two images (before and after). Upload from your computer or paste two URLs.
            Reorder cases with the arrows. The public page shows before and after side by side.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={dashStyles.alert} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ ...dashStyles.card, mb: 3 }} component="form" onSubmit={handleAddPair}>
        <Typography sx={{ ...dashStyles.sectionTitle, mb: 2 }}>
          Add one case (before + after)
        </Typography>
        <Stack spacing={2} sx={{ maxWidth: 560 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FilePick
              label="Before photo"
              file={beforeFile}
              inputKey={`b-${fileKey}`}
              onChange={(e) => setBeforeFile(e.target.files?.[0] || null)}
            />
            <FilePick
              label="After photo"
              file={afterFile}
              inputKey={`a-${fileKey}`}
              onChange={(e) => setAfterFile(e.target.files?.[0] || null)}
            />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Or paste two URLs (leave file picks empty if using URLs):
          </Typography>
          <TextField
            size="small"
            label="Before image URL"
            value={urlBefore}
            onChange={(e) => setUrlBefore(e.target.value)}
            fullWidth
          />
          <TextField
            size="small"
            label="After image URL"
            value={urlAfter}
            onChange={(e) => setUrlAfter(e.target.value)}
            fullWidth
          />
          <TextField label="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
          <TextField
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
          <TextField label="Category (optional)" value={category} onChange={(e) => setCategory(e.target.value)} fullWidth />
          <Box>
            <Button
              type="submit"
              variant="contained"
              disabled={saving || !canSubmitPair}
              sx={dashStyles.primaryBtn}
            >
              Add case
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={dashStyles.card}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width={72} sx={dashStyles.tableHeaderCell}>Order</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Before</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>After</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Title</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Category</TableCell>
              <TableCell align="right" sx={dashStyles.tableHeaderCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cases.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary">No cases yet.</Typography>
                </TableCell>
              </TableRow>
            )}
            {cases.map((row, index) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Stack direction="row">
                    <IconButton size="small" aria-label="Move up" disabled={index === 0} onClick={() => moveItem(index, -1)}>
                      <KeyboardArrowUpIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label="Move down"
                      disabled={index === cases.length - 1}
                      onClick={() => moveItem(index, 1)}
                    >
                      <KeyboardArrowDownIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
                <TableCell>
                  {row.beforeImageUrl ? (
                    <Box
                      component="img"
                      src={row.beforeImageUrl}
                      alt=""
                      sx={{
                        width: 84,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(13,42,42,0.12)',
                      }}
                    />
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell>
                  {row.afterImageUrl ? (
                    <Box
                      component="img"
                      src={row.afterImageUrl}
                      alt=""
                      sx={{
                        width: 84,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(13,42,42,0.12)',
                      }}
                    />
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell>{row.title || '—'}</TableCell>
                <TableCell>{row.category || '—'}</TableCell>
                <TableCell align="right">
                  <IconButton aria-label="Edit" size="small" onClick={() => openEdit(row)}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton aria-label="Delete" onClick={() => remove(row.id)} size="small" color="error">
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={editOpen} onClose={() => !saving && setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit case</DialogTitle>
        <DialogContent>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1, mb: 1 }}>
            Replace images by choosing new files, or edit URLs below.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <FilePick
              label="New before (optional)"
              file={editBeforeFile}
              inputKey={`eb-${editFileKey}`}
              onChange={(e) => setEditBeforeFile(e.target.files?.[0] || null)}
            />
            <FilePick
              label="New after (optional)"
              file={editAfterFile}
              inputKey={`ea-${editFileKey}`}
              onChange={(e) => setEditAfterFile(e.target.files?.[0] || null)}
            />
          </Stack>
          <TextField margin="dense" label="Before image URL" fullWidth value={editBeforeUrl} onChange={(e) => setEditBeforeUrl(e.target.value)} />
          <TextField margin="dense" label="After image URL" fullWidth value={editAfterUrl} onChange={(e) => setEditAfterUrl(e.target.value)} />
          <TextField margin="dense" label="Title" fullWidth value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            minRows={2}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <TextField margin="dense" label="Category" fullWidth value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={saveEdit} variant="contained" disabled={saving} sx={dashStyles.primaryBtn}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
