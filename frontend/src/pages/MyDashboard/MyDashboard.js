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
  Avatar,
  Stack,
  Rating,
  IconButton,
  Tooltip,
} from '@mui/material';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import {
  fetchMyThreads,
  fetchMyThreadMessages,
  postMyThreadReply,
  fetchMyAppointments,
  deleteMyAccount,
  fetchMyTestimonials,
  createMyTestimonial,
  deleteMyTestimonial,
} from '../../services/api';
import styles from './myDashboard.styles';

function formatWhen(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}

function formatShortWhen(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 2, color: '#088a87' }}>
        <CircularProgress color="inherit" />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Loading your conversations…
        </Typography>
      </Box>
    );
  }

  if (!threads.length) {
    return (
      <Box sx={styles.emptyState}>
        <Box sx={styles.emptyIcon}>
          <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 'inherit', color: '#0db1ad' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f2a2a', mb: 1 }}>
          No conversations yet
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 420, mx: 'auto' }}>
          When you send a message from the contact page while logged in, your
          conversation with the clinic will appear here.
        </Typography>
        <Button component={Link} to="/contact" variant="contained" sx={styles.primaryCta}>
          Go to contact page
        </Button>
      </Box>
    );
  }

  const selected = threads.find((t) => t.threadId === selectedId);

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, minHeight: 480 }}>
      <Paper elevation={0} sx={styles.threadListCard}>
        <Box sx={styles.threadHeader}>Conversations</Box>
        <List dense disablePadding>
          {threads.map((t) => {
            const isSelected = t.threadId === selectedId;
            return (
              <ListItemButton
                key={t.threadId}
                selected={isSelected}
                onClick={() => setSelectedId(t.threadId)}
                sx={styles.threadItem(isSelected)}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    mr: 1.5,
                    background: 'linear-gradient(135deg, #0db1ad, #088a87)',
                    color: '#fff',
                  }}
                >
                  <LocalHospitalOutlinedIcon fontSize="small" />
                </Avatar>
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: isSelected ? 700 : 600, color: '#0f2a2a', fontSize: '0.92rem' }}>
                      {t.lastPreview?.slice(0, 48) || 'Conversation'}
                      {t.lastPreview && t.lastPreview.length > 48 ? '…' : ''}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: '#5a6b6b' }}>
                      {formatShortWhen(t.lastAt)}
                    </Typography>
                  }
                />
                {t.unreadCount > 0 && (
                  <Chip size="small" label={t.unreadCount} sx={styles.badge} />
                )}
              </ListItemButton>
            );
          })}
        </List>
      </Paper>

      <Paper elevation={0} sx={styles.conversationCard}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {selected && (
          <Box sx={styles.conversationMeta}>
            Conversation · last activity {formatWhen(selected.lastAt)}
          </Box>
        )}
        <Box sx={styles.messagesScroll}>
          {loadingMessages ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={28} sx={{ color: '#0db1ad' }} />
            </Box>
          ) : (
            messages.map((m) => {
              const mine = m.senderRole !== 'admin';
              return (
                <Box key={m.id} sx={styles.bubbleRow(mine)}>
                  <Paper elevation={0} sx={styles.bubble(mine)}>
                    <Typography sx={styles.bubbleMeta(mine)}>
                      {mine ? 'You' : 'Clinic'} · {formatWhen(m.createdAt)}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>
                      {m.message}
                    </Typography>
                  </Paper>
                </Box>
              );
            })
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
          sx={styles.replyInput}
        />
        <Button
          variant="contained"
          onClick={send}
          disabled={sending || !draft.trim()}
          endIcon={<SendRoundedIcon />}
          sx={styles.sendBtn}
        >
          {sending ? 'Sending…' : 'Send'}
        </Button>
      </Paper>
    </Box>
  );
}

function statusLabel(status) {
  if (!status) return '—';
  return status.charAt(0).toUpperCase() + status.slice(1);
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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 2, color: '#088a87' }}>
        <CircularProgress color="inherit" />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Loading your appointments…
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      {rows.length === 0 && !error ? (
        <Box sx={styles.emptyState}>
          <Box sx={styles.emptyIcon}>
            <EventBusyOutlinedIcon sx={{ fontSize: 'inherit', color: '#0db1ad' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f2a2a', mb: 1 }}>
            No appointments yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 420, mx: 'auto' }}>
            Book your first visit and keep track of upcoming and past visits right here.
          </Typography>
          <Button component={Link} to="/book-appointment" variant="contained" sx={styles.primaryCta}>
            Book an appointment
          </Button>
        </Box>
      ) : (
        <Paper elevation={0} sx={{ ...styles.card, p: 0, overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={styles.tableHeadCell}>When</TableCell>
                <TableCell sx={styles.tableHeadCell}>Status</TableCell>
                <TableCell sx={styles.tableHeadCell}>Assigned</TableCell>
                <TableCell sx={styles.tableHeadCell}>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((a) => (
                <TableRow key={a.id} sx={styles.appointmentRow}>
                  <TableCell sx={{ fontWeight: 600, color: '#0f2a2a' }}>
                    {formatWhen(a.appointmentDate)}
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={statusLabel(a.status)} sx={styles.statusChip(a.status)} />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {a.assignedStaff?.username ? (
                        <>
                          <Avatar
                            sx={{
                              width: 26,
                              height: 26,
                              fontSize: '0.78rem',
                              background: 'linear-gradient(135deg, #0db1ad, #088a87)',
                              color: '#fff',
                            }}
                          >
                            {a.assignedStaff.username.slice(0, 1).toUpperCase()}
                          </Avatar>
                          <Typography variant="body2">{a.assignedStaff.username}</Typography>
                        </>
                      ) : (
                        <Typography variant="body2" color="text.secondary">—</Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 320, whiteSpace: 'pre-wrap', color: '#5a6b6b' }}>
                    {a.notes || '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}

function testimonialStatusChipSx(status) {
  const map = {
    approved: { bg: 'rgba(13,177,173,0.14)', color: '#088a87' },
    pending:  { bg: 'rgba(255,176,45,0.18)', color: '#a06200' },
    rejected: { bg: 'rgba(180,66,50,0.14)', color: '#b44232' },
  };
  const v = map[status] || { bg: 'rgba(90,107,107,0.14)', color: '#3b4a4a' };
  return {
    bgcolor: v.bg,
    color: v.color,
    fontWeight: 700,
    textTransform: 'capitalize',
    borderRadius: '999px',
  };
}

function TestimonialsPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const data = await fetchMyTestimonials();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const hasActive = rows.some((r) => r.status === 'pending' || r.status === 'approved');

  const submit = async (e) => {
    e?.preventDefault?.();
    const trimmed = text.trim();
    setError('');
    setInfo('');
    if (trimmed.length < 10) {
      setError('Please write at least 10 characters.');
      return;
    }
    if (trimmed.length > 2000) {
      setError('Please keep it under 2000 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await createMyTestimonial({ text: trimmed, rating });
      setText('');
      setRating(5);
      setInfo('Thanks! Your testimonial was submitted and is awaiting review.');
      await load();
    } catch (e2) {
      setError(e2.message || 'Failed to submit testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    setError('');
    setInfo('');
    try {
      await deleteMyTestimonial(id);
      setInfo('Testimonial deleted.');
      await load();
    } catch (e) {
      setError(e.message || 'Failed to delete testimonial');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper elevation={0} sx={styles.card}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '14px',
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, rgba(13,177,173,0.18), rgba(255,123,107,0.18))',
              color: '#0db1ad',
            }}
          >
            <RateReviewOutlinedIcon />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#0f2a2a', fontSize: '1.1rem' }}>
              Share your experience
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your testimonial will appear on our homepage after the clinic reviews it.
            </Typography>
          </Box>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {info && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setInfo('')}>
            {info}
          </Alert>
        )}

        {hasActive ? (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            You already have a testimonial on file. Delete it below to submit a new one.
          </Alert>
        ) : (
          <Box component="form" onSubmit={submit}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Typography sx={{ fontWeight: 600, color: '#0f2a2a' }}>
                Your rating
              </Typography>
              <Rating
                value={rating}
                onChange={(_, v) => setRating(v || 1)}
                size="large"
                sx={{ color: '#ffb02d' }}
              />
            </Stack>
            <TextField
              fullWidth
              multiline
              minRows={4}
              placeholder="What did you love about your visit? (min 10 characters)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              inputProps={{ maxLength: 2000 }}
              sx={styles.replyInput}
            />
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {text.length}/2000
              </Typography>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting || text.trim().length < 10}
                endIcon={<SendRoundedIcon />}
                sx={styles.sendBtn}
              >
                {submitting ? 'Submitting…' : 'Submit testimonial'}
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>

      <Paper elevation={0} sx={styles.card}>
        <Typography sx={{ fontWeight: 700, color: '#0f2a2a', fontSize: '1.05rem', mb: 2 }}>
          Your submissions
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} sx={{ color: '#0db1ad' }} />
          </Box>
        ) : rows.length === 0 ? (
          <Box sx={styles.emptyState}>
            <Box sx={styles.emptyIcon}>
              <FormatQuoteRoundedIcon sx={{ fontSize: 'inherit', color: '#0db1ad' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f2a2a', mb: 1 }}>
              No testimonials yet
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 420, mx: 'auto' }}>
              Use the form above to share your experience with Bright Smile.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {rows.map((t) => (
              <Paper
                key={t.id}
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid rgba(13,177,173,0.18)',
                  background: 'linear-gradient(180deg, #ffffff, #f7fbfb)',
                  position: 'relative',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Chip size="small" label={statusLabel(t.status)} sx={testimonialStatusChipSx(t.status)} />
                    <Rating value={Number(t.rating) || 0} readOnly size="small" sx={{ color: '#ffb02d' }} />
                    <Typography variant="caption" color="text.secondary">
                      {formatWhen(t.createdAt)}
                    </Typography>
                  </Stack>
                  <Tooltip title="Delete testimonial">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(t.id)}
                      sx={{ color: '#b44232' }}
                      aria-label="Delete testimonial"
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ mt: 1.5, color: '#0f2a2a', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
                >
                  {t.text}
                </Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
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

  const username =
    (typeof window !== 'undefined' && localStorage.getItem('username')) || 'Patient';

  return (
    <Box>
      <Paper elevation={0} sx={styles.accountCard}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ sm: 'center' }}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              background: 'linear-gradient(135deg, #0db1ad, #088a87)',
              color: '#fff',
              fontSize: '1.8rem',
              fontWeight: 700,
              boxShadow: '0 6px 18px rgba(13,177,173,0.30)',
            }}
          >
            {username.slice(0, 1).toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#0f2a2a', fontSize: '1.2rem' }}>
              {username}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
              <PersonOutlineOutlinedIcon sx={{ fontSize: 18, color: '#5a6b6b' }} />
              <Typography variant="body2" color="text.secondary">
                Patient account
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Box sx={styles.dangerZone}>
        <Typography sx={styles.dangerTitle}>
          <WarningAmberOutlinedIcon fontSize="small" />
          Danger zone
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
          Deleting your account removes your login permanently. Bookings you
          made may stay in the clinic schedule with your user link cleared, and
          messages you sent may remain visible to staff without your account
          attached. This action <strong>cannot be undone</strong>.
        </Typography>
        <Button variant="outlined" onClick={() => setOpen(true)} sx={styles.deleteBtn}>
          Delete my account…
        </Button>
      </Box>

      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm" sx={styles.dialog}>
        <DialogTitle sx={{ fontWeight: 700, color: '#0f2a2a' }}>
          Delete your account?
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }} icon={<WarningAmberOutlinedIcon />}>
            This action is permanent and cannot be undone.
          </Alert>
          <Typography paragraph sx={{ color: '#5a6b6b' }}>
            To confirm, type <strong style={{ color: '#b44232' }}>DELETE</strong> (all caps) below.
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
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} disabled={deleting} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={confirmText !== 'DELETE' || deleting}
            onClick={handleDelete}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3 }}
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
  const username =
    (typeof window !== 'undefined' && localStorage.getItem('username')) || '';

  return (
    <Box sx={styles.page}>
      <Box sx={styles.container}>
        <Box component="span" sx={styles.eyebrow}>
          Patient Portal
        </Box>
        <Typography variant="h1" component="h1" sx={styles.heading}>
          {username ? `Welcome back, ${username}` : 'My dashboard'}
        </Typography>
        <Typography sx={styles.subheading}>
          Your conversations with the clinic, upcoming appointments, testimonials,
          and account settings — all in one place.
        </Typography>

        <Box sx={styles.tabsWrap}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab icon={<ForumOutlinedIcon />} iconPosition="start" label="Messages" />
            <Tab icon={<EventAvailableOutlinedIcon />} iconPosition="start" label="Appointments" />
            <Tab icon={<RateReviewOutlinedIcon />} iconPosition="start" label="Testimonials" />
            <Tab icon={<ManageAccountsOutlinedIcon />} iconPosition="start" label="Account" />
          </Tabs>
        </Box>

        {tab === 0 && <MessagesPanel />}
        {tab === 1 && <AppointmentsPanel />}
        {tab === 2 && <TestimonialsPanel />}
        {tab === 3 && <AccountPanel />}
      </Box>
    </Box>
  );
}
