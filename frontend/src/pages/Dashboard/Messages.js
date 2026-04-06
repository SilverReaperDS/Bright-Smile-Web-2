import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Button,
  Alert,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  fetchAdminThreadSummaries,
  fetchAdminThreadMessages,
  postAdminThreadReply,
  deleteAdminMessage,
} from '../../services/api';

function formatWhen(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}

export default function Messages() {
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
      const data = await fetchAdminThreadSummaries();
      setThreads(data);
      setSelectedId((prev) => {
        if (prev && data.some((t) => t.threadId === prev)) return prev;
        return data[0]?.threadId ?? null;
      });
    } catch (e) {
      setError(e.message || 'Failed to load threads');
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
      const data = await fetchAdminThreadMessages(threadId);
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
      await postAdminThreadReply(selectedId, text);
      setDraft('');
      await loadMessages(selectedId);
      await loadThreads();
    } catch (e) {
      setError(e.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const remove = async (id) => {
    try {
      await deleteAdminMessage(id);
      await loadMessages(selectedId);
      await loadThreads();
    } catch (e) {
      setError(e.message);
    }
  };

  if (loadingThreads) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={28} />
        <Typography>Loading conversations…</Typography>
      </Box>
    );
  }

  const selected = threads.find((t) => t.threadId === selectedId);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Contact messages
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Open a thread to read and reply. Patient messages are marked read when you open the thread.
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {threads.length === 0 ? (
        <Typography color="text.secondary">No messages yet.</Typography>
      ) : (
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, minHeight: 480 }}>
          <Paper variant="outlined" sx={{ width: { xs: '100%', md: 300 }, flexShrink: 0 }}>
            <List dense disablePadding>
              {threads.map((t) => (
                <ListItemButton
                  key={t.threadId}
                  selected={t.threadId === selectedId}
                  onClick={() => setSelectedId(t.threadId)}
                >
                  <ListItemText
                    primary={t.name || t.email || 'Unknown'}
                    secondary={`${(t.lastPreview || '').slice(0, 48)}${(t.lastPreview || '').length > 48 ? '…' : ''}\n${formatWhen(t.lastAt)}`}
                    secondaryTypographyProps={{ variant: 'caption', whiteSpace: 'pre-line' }}
                  />
                  {t.unreadCount > 0 && (
                    <Chip size="small" label={t.unreadCount} color="primary" sx={{ ml: 0.5 }} />
                  )}
                </ListItemButton>
              ))}
            </List>
          </Paper>

          <Paper variant="outlined" sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
            {selected && (
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                {selected.name} · {selected.email} · {selected.phone || '—'}
              </Typography>
            )}
            <Box sx={{ flex: 1, overflow: 'auto', mb: 2, maxHeight: { xs: 320, md: 'none' } }}>
              {loadingMessages ? (
                <CircularProgress size={28} />
              ) : (
                messages.map((m) => (
                  <Box
                    key={m.id}
                    sx={{
                      mb: 1.5,
                      display: 'flex',
                      justifyContent: m.senderRole === 'patient' ? 'flex-start' : 'flex-end',
                      alignItems: 'flex-start',
                      gap: 0.5,
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        px: 1.5,
                        py: 1,
                        maxWidth: '82%',
                        bgcolor: m.senderRole === 'patient' ? 'action.hover' : 'primary.main',
                        color: m.senderRole === 'patient' ? 'text.primary' : 'primary.contrastText',
                      }}
                    >
                      <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>
                        {m.senderRole === 'patient' ? 'Patient' : 'You'} · {formatWhen(m.createdAt)}
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {m.message}
                      </Typography>
                    </Paper>
                    <IconButton
                      size="small"
                      aria-label="delete message"
                      onClick={() => remove(m.id)}
                      color="error"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))
              )}
            </Box>
            <TextField
              fullWidth
              multiline
              minRows={2}
              placeholder="Reply to patient…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={!selectedId || sending}
            />
            <Button sx={{ mt: 1, alignSelf: 'flex-end' }} variant="contained" onClick={send} disabled={sending}>
              Send reply
            </Button>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
