// src/pages/Contact/Contact.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import styles from './contact.styles';
import { postContactMessage, getMe } from '../../services/api';

export default function Contact() {
  const [account, setAccount] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((data) => setAccount(data))
      .catch(() => setLoadError('Could not load your account. Try logging in again.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSending(true);
    try {
      await postContactMessage({ message: message.trim() });
      setMessage('');
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Box sx={styles.root}>
        <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  if (loadError || !account) {
    return (
      <Box sx={styles.root}>
        <Container maxWidth="sm">
          <Alert severity="error">{loadError || 'You must be signed in to use contact.'}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={styles.root}>
      <Container maxWidth="sm">
        <Box sx={styles.header}>
          <Typography variant="h4" component="h1" id="contact-heading" sx={styles.title}>
            Contact Us
          </Typography>
          <Typography id="contact-desc" sx={styles.subtitle}>
            Write your message below. We use the name, email, and phone from your account.
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Message sent. Our team will see it in the dashboard shortly.
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Sending from your account
          </Typography>
          <Typography variant="body2">
            <strong>Name:</strong> {account.username}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {account.email}
          </Typography>
          <Typography variant="body2">
            <strong>Phone:</strong> {account.phone || '—'}
          </Typography>
        </Paper>

        <Box
          component="form"
          role="form"
          aria-describedby="contact-desc"
          onSubmit={handleSubmit}
          sx={styles.form}
        >
          <TextField
            id="message"
            name="message"
            label="Your Message"
            placeholder="Your Message"
            multiline
            rows={6}
            variant="outlined"
            required
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Box sx={styles.buttonWrapper}>
            <Button
              type="submit"
              variant="contained"
              aria-label="Send message"
              sx={styles.button}
              disabled={sending}
            >
              {sending ? 'Sending…' : 'Send Message'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
