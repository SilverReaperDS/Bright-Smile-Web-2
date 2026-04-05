import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import { bookAppointment } from '../../services/api';

function defaultDateTimeLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  d.setHours(d.getHours() + 1, 0, 0, 0);
  return d.toISOString().slice(0, 16);
}

export default function BookAppointment() {
  const [when, setWhen] = useState(defaultDateTimeLocal);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);
    try {
      await bookAppointment({
        appointmentDate: new Date(when).toISOString(),
        notes: notes.trim() || undefined,
      });
      setSuccess(true);
      setNotes('');
      setWhen(defaultDateTimeLocal());
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Book an appointment
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Choose a date and time. We&apos;ll confirm your visit as soon as possible.
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Request received. Your appointment is pending confirmation.
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Preferred date & time"
            type="datetime-local"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Notes (optional)"
            placeholder="Reason for visit, preferences, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            fullWidth
            size="large"
            sx={{
              py: 1.5,
              textTransform: 'none',
              backgroundColor: '#0db1ad',
              '&:hover': { backgroundColor: '#178e8b' },
            }}
          >
            {submitting ? 'Sending…' : 'Request appointment'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
