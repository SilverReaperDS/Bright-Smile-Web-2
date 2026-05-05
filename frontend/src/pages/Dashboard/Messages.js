import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import {
  fetchAdminThreadSummaries,
  fetchAdminThreadMessages,
  postAdminThreadReply,
  deleteAdminMessage,
  initializeRealtimeSocket,
  disconnectRealtimeSocket,
  realtimeJoinThread,
  realtimeLeaveThread,
} from '../../services/api';
import dashStyles from './dashboard.styles';

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
  const selectedIdRef = useRef(null);

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

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    const socket = initializeRealtimeSocket();
    if (!socket) return undefined;

    const onMessageNew = async (payload) => {
      const activeThreadId = selectedIdRef.current;
      if (payload?.threadId && payload.threadId === activeThreadId) {
        await loadMessages(activeThreadId);
      }
      await loadThreads();
    };

    const onThreadUpdated = async () => {
      await loadThreads();
    };

    socket.on('message:new', onMessageNew);
    socket.on('thread:updated', onThreadUpdated);

    return () => {
      socket.off('message:new', onMessageNew);
      socket.off('thread:updated', onThreadUpdated);
      disconnectRealtimeSocket();
    };
  }, [loadMessages, loadThreads]);

  useEffect(() => {
    if (!selectedId) return undefined;
    realtimeJoinThread(selectedId);
    return () => realtimeLeaveThread(selectedId);
  }, [selectedId]);

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 3 }}>
        <CircularProgress size={28} sx={{ color: '#0db1ad' }} />
        <Typography sx={{ color: '#5a6b6b' }}>Loading conversations…</Typography>
      </Box>
    );
  }

  const selected = threads.find((t) => t.threadId === selectedId);

  return (
    <Box>
      <Box sx={dashStyles.pageHeader}>
        <Box>
          <Typography component="h1" sx={dashStyles.pageTitle}>
            Contact messages
          </Typography>
          <Typography sx={dashStyles.pageSubtitle}>
            Open a thread to read and reply. Patient messages are marked read when you open the thread.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={dashStyles.alert} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {threads.length === 0 ? (
        <Paper elevation={0} sx={dashStyles.card}>
          <Typography color="text.secondary">No messages yet.</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, minHeight: 520 }}>
          <Paper
            elevation={0}
            sx={{
              ...dashStyles.card,
              p: 0,
              width: { xs: '100%', md: 320 },
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            <List dense disablePadding>
              {threads.map((t) => {
                const isActive = t.threadId === selectedId;
                return (
                  <ListItemButton
                    key={t.threadId}
                    selected={isActive}
                    onClick={() => setSelectedId(t.threadId)}
                    sx={{
                      borderLeft: isActive ? '3px solid #0db1ad' : '3px solid transparent',
                      backgroundColor: isActive ? '#e6faf9' : 'transparent',
                      py: 1.2,
                      '&.Mui-selected': {
                        backgroundColor: '#e6faf9',
                        '&:hover': { backgroundColor: '#d4f4f2' },
                      },
                      '&:hover': {
                        backgroundColor: isActive ? '#d4f4f2' : 'rgba(13,177,173,0.05)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={t.name || t.email || 'Unknown'}
                      secondary={`${(t.lastPreview || '').slice(0, 48)}${(t.lastPreview || '').length > 48 ? '…' : ''}\n${formatWhen(t.lastAt)}`}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 700 : 600,
                        color: '#0f2a2a',
                        fontSize: '0.92rem',
                      }}
                      secondaryTypographyProps={{ variant: 'caption', whiteSpace: 'pre-line', color: '#5a6b6b' }}
                    />
                    {t.unreadCount > 0 && (
                      <Chip
                        size="small"
                        label={t.unreadCount}
                        sx={{
                          ml: 0.5,
                          background: 'linear-gradient(135deg, #ff7b6b, #ff5c4d)',
                          color: '#fff',
                          fontWeight: 700,
                        }}
                      />
                    )}
                  </ListItemButton>
                );
              })}
            </List>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              ...dashStyles.card,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {selected && (
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  color: '#0f2a2a',
                  fontWeight: 700,
                  pb: 1.5,
                  borderBottom: '1px solid rgba(13,177,173,0.10)',
                }}
              >
                {selected.name} ·{' '}
                <Box component="span" sx={{ color: '#5a6b6b', fontWeight: 500 }}>
                  {selected.email} · {selected.phone || '—'}
                </Box>
              </Typography>
            )}
            <Box sx={{ flex: 1, overflow: 'auto', mb: 2, maxHeight: { xs: 340, md: 'none' } }}>
              {loadingMessages ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
                  <CircularProgress size={24} sx={{ color: '#0db1ad' }} />
                  <Typography sx={{ color: '#5a6b6b' }}>Loading messages…</Typography>
                </Box>
              ) : (
                messages.map((m) => {
                  const isPatient = m.senderRole === 'patient';
                  return (
                    <Box
                      key={m.id}
                      sx={{
                        mb: 1.5,
                        display: 'flex',
                        justifyContent: isPatient ? 'flex-start' : 'flex-end',
                        alignItems: 'flex-start',
                        gap: 0.5,
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          px: 1.8,
                          py: 1.2,
                          maxWidth: '78%',
                          borderRadius: 3,
                          background: isPatient
                            ? '#f4f6f6'
                            : 'linear-gradient(135deg, #0db1ad, #088a87)',
                          color: isPatient ? '#0f2a2a' : '#fff',
                          boxShadow: isPatient
                            ? '0 2px 6px rgba(13,42,42,0.06)'
                            : '0 4px 12px rgba(13,177,173,0.25)',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: isPatient ? 0.7 : 0.9,
                            display: 'block',
                            fontWeight: 600,
                            mb: 0.3,
                          }}
                        >
                          {isPatient ? 'Patient' : 'You'} · {formatWhen(m.createdAt)}
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
                  );
                })
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              sx={{ mt: 1.5, alignSelf: 'flex-end', ...dashStyles.primaryBtn }}
              variant="contained"
              onClick={send}
              disabled={sending}
              startIcon={<SendOutlinedIcon />}
            >
              Send reply
            </Button>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
