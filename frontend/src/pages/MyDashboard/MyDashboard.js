import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Button,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  fetchMyThreads,
  fetchMyThreadMessages,
  postMyThreadReply,
  fetchMyAppointments,
  deleteMyAccount,
} from '../../services/api';

function formatWhen(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}

function MessagesPanel() {
  const [threads, setThreads] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const loadThreads = useCallback(async () => {
    setError('');
    setLoadingThreads(true);
    try {
      const data = await fetchMyThreads();
      setThreads(data);
      setSelectedId((prev) => {
        if (prev && data.some((t) => t.threadId === prev)) return prev;
        return data[0]?.threadId ?? null;
      });
    } catch (e) {
      setError(e.message || 'Failed to load conversations');
    } finally {
      setLoadingThreads(false);
    }
  }, []);

  const loadMessages = useCallback(async (threadId) => {
    if (!threadId) {
      setMessages([]);
      return;
    }
    setError('');
    setLoadingMessages(true);
    try {
      const data = await fetchMyThreadMessages(threadId);
      setMessages(data);
    } catch (e) {
      setError(e.message || 'Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  useEffect(() => {
    loadMessages(selectedId);
  }, [selectedId, loadMessages]);

  const send = async () => {
    const text = draft.trim();
    if (!text || !selectedId) return;
    setSending(true);
    setError('');
    try {
      await postMyThreadReply(selectedId, text);
      setDraft('');
      await loadMessages(selectedId);
      await loadThreads();
    } catch (e) {
      setError(e.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  if (loadingThreads) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!threads.length) {
    return (
      <Box>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          You do not have any messages with the clinic yet. After you send a message from the contact
          page while logged in, the conversation will appear here.
        </Typography>
        <Button component={Link} to="/contact" variant="contained">
          Go to contact
        </Button>
      </Box>
    );
  }

  const selected = threads.find((t) => t.threadId === selectedId);

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, minHeight: 420 }}>
      <Paper variant="outlined" sx={{ width: { xs: '100%', md: 280 }, flexShrink: 0 }}>
        <List dense disablePadding>
          {threads.map((t) => (
            <ListItemButton
              key={t.threadId}
              selected={t.threadId === selectedId}
              onClick={() => setSelectedId(t.threadId)}
            >
              <ListItemText
                primary={t.lastPreview?.slice(0, 60) || 'Conversation'}
                secondary={formatWhen(t.lastAt)}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
              {t.unreadCount > 0 && (
                <Chip size="small" label={t.unreadCount} color="primary" sx={{ ml: 1 }} />
              )}
            </ListItemButton>
          ))}
        </List>
      </Paper>

      <Paper variant="outlined" sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {selected && (
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Conversation · last activity {formatWhen(selected.lastAt)}
          </Typography>
        )}
        <Box sx={{ flex: 1, overflow: 'auto', mb: 2, maxHeight: { xs: 360, md: 'none' } }}>
          {loadingMessages ? (
            <CircularProgress size={28} />
          ) : (
            messages.map((m) => (
              <Box
                key={m.id}
                sx={{
                  mb: 1.5,
                  display: 'flex',
                  justifyContent: m.senderRole === 'admin' ? 'flex-start' : 'flex-end',
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    px: 1.5,
                    py: 1,
                    maxWidth: '85%',
                    bgcolor: m.senderRole === 'admin' ? 'action.hover' : 'primary.main',
                    color: m.senderRole === 'admin' ? 'text.primary' : 'primary.contrastText',
                  }}
                >
                  <Typography variant="caption" sx={{ opacity: 0.85, display: 'block' }}>
                    {m.senderRole === 'admin' ? 'Clinic' : 'You'} · {formatWhen(m.createdAt)}
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {m.message}
                  </Typography>
                </Paper>
              </Box>
            ))
          )}
        </Box>
        <TextField
          fullWidth
          multiline
          minRows={2}
          placeholder="Write a reply…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={!selectedId || sending}
        />
        <Button sx={{ mt: 1, alignSelf: 'flex-end' }} variant="contained" onClick={send} disabled={sending}>
          Send
        </Button>
      </Paper>
    </Box>
  );
}

function AppointmentsPanel() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchMyAppointments();
        if (!cancelled) setRows(data);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load appointments');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>When</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Assigned</TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography color="text.secondary">No appointments yet.</Typography>
              </TableCell>
            </TableRow>
          )}
          {rows.map((a) => (
            <TableRow key={a.id}>
              <TableCell>{formatWhen(a.appointmentDate)}</TableCell>
              <TableCell>{a.status}</TableCell>
              <TableCell>{a.assignedStaff?.username || '—'}</TableCell>
              <TableCell sx={{ maxWidth: 280, whiteSpace: 'pre-wrap' }}>{a.notes || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

function AccountPanel() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const closeDialog = () => {
    if (deleting) return;
    setOpen(false);
    setConfirmText('');
    setError('');
  };

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return;
    setDeleting(true);
    setError('');
    try {
      await deleteMyAccount();
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      navigate('/');
    } catch (e) {
      setError(e.message || 'Could not delete account');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Account
      </Typography>
      <Typography color="text.secondary" paragraph>
        Deleting your account removes your login. Bookings you made may stay in the clinic schedule with your user link
        cleared. Messages you sent may remain visible to staff without your account attached.
      </Typography>
      <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
        Delete my account…
      </Button>

      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>Delete your account?</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            This cannot be undone. Type <strong>DELETE</strong> (all caps) to confirm.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Confirmation"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={deleting}
            placeholder="DELETE"
            sx={{ mt: 1 }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={deleting}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={confirmText !== 'DELETE' || deleting}
            onClick={handleDelete}
          >
            {deleting ? 'Deleting…' : 'Delete forever'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function MyDashboard() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        My dashboard
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Messages with the clinic, your appointments, and account options.
      </Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Messages" />
        <Tab label="Appointments" />
        <Tab label="Account" />
      </Tabs>
      {tab === 0 && <MessagesPanel />}
      {tab === 1 && <AppointmentsPanel />}
      {tab === 2 && <AccountPanel />}
    </Box>
  );
}
