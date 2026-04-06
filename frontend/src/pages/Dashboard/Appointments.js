import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  TextField,
  Alert,
} from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  fetchAppointments,
  fetchAppointmentStaff,
  patchAppointment,
  deleteAppointment,
  downloadAppointmentsCsv,
} from '../../services/api';

function pad(n) {
  return String(n).padStart(2, '0');
}

function toLocalInputValue(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function sameLocalDay(a, b) {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function statusColor(status) {
  if (status === 'confirmed') return 'success';
  if (status === 'canceled') return 'default';
  return 'warning';
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [cursorMonth, setCursorMonth] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const [reschedule, setReschedule] = useState(null);
  const [rescheduleAt, setRescheduleAt] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setError('');
    try {
      const [apts, stf] = await Promise.all([fetchAppointments(), fetchAppointmentStaff()]);
      setAppointments(apts);
      setStaff(stf);
    } catch (e) {
      setError(e.message || 'Could not load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const countsByDay = useMemo(() => {
    const map = new Map();
    for (const a of appointments) {
      const key = new Date(a.appointmentDate).toDateString();
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [appointments]);

  const calendarCells = useMemo(() => {
    const y = cursorMonth.getFullYear();
    const m = cursorMonth.getMonth();
    const firstDow = new Date(y, m, 1).getDay();
    const nDays = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDow; i += 1) cells.push(null);
    for (let d = 1; d <= nDays; d += 1) cells.push(new Date(y, m, d));
    return cells;
  }, [cursorMonth]);

  const listForSelectedDay = useMemo(
    () => appointments.filter((a) => sameLocalDay(a.appointmentDate, selectedDay)),
    [appointments, selectedDay]
  );

  const handleConfirm = async (id) => {
    try {
      await patchAppointment(id, { status: 'confirmed' });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleCancel = async (id) => {
    try {
      await patchAppointment(id, { status: 'canceled' });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleStaffChange = async (id, assignedStaffId) => {
    try {
      await patchAppointment(id, { assignedStaffId: assignedStaffId || null });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const openReschedule = (apt) => {
    setReschedule(apt);
    setRescheduleAt(toLocalInputValue(apt.appointmentDate));
  };

  const submitReschedule = async () => {
    if (!reschedule || !rescheduleAt) return;
    try {
      await patchAppointment(reschedule.id, { appointmentDate: new Date(rescheduleAt).toISOString() });
      setReschedule(null);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleExport = async () => {
    try {
      await downloadAppointmentsCsv();
    } catch (e) {
      setError(e.message);
    }
  };

  const confirmDeleteAppointment = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAppointment(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      setError(e.message);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return <Typography>Loading appointments…</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Appointments</Typography>
        <Button variant="outlined" onClick={handleExport}>
          Export CSV
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <IconButton onClick={() => setCursorMonth(new Date(cursorMonth.getFullYear(), cursorMonth.getMonth() - 1, 1))}>
                <ChevronLeft />
              </IconButton>
              <Typography variant="h6">
                {cursorMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </Typography>
              <IconButton onClick={() => setCursorMonth(new Date(cursorMonth.getFullYear(), cursorMonth.getMonth() + 1, 1))}>
                <ChevronRight />
              </IconButton>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, textAlign: 'center' }}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <Typography key={d} variant="caption" color="text.secondary" sx={{ py: 0.5 }}>
                  {d}
                </Typography>
              ))}
              {calendarCells.map((day, idx) => {
                if (!day) return <Box key={`e-${idx}`} />;
                const key = day.toDateString();
                const count = countsByDay.get(key) || 0;
                const isSel = sameLocalDay(day, selectedDay);
                return (
                  <Button
                    key={key}
                    size="small"
                    variant={isSel ? 'contained' : 'text'}
                    onClick={() => setSelectedDay(day)}
                    sx={{ minWidth: 0, py: 1, flexDirection: 'column', lineHeight: 1.2 }}
                  >
                    <span>{day.getDate()}</span>
                    {count > 0 && (
                      <Typography component="span" variant="caption" sx={{ opacity: 0.9 }}>
                        {count} apt
                      </Typography>
                    )}
                  </Button>
                );
              })}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {selectedDay.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Staff</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listForSelectedDay.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography color="text.secondary">No appointments this day.</Typography>
                    </TableCell>
                  </TableRow>
                )}
                {listForSelectedDay.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell>
                      {new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell>{apt.patient?.username || '—'}</TableCell>
                    <TableCell>
                      <Chip size="small" label={apt.status} color={statusColor(apt.status)} />
                    </TableCell>
                    <TableCell sx={{ minWidth: 140 }}>
                      <FormControl size="small" fullWidth>
                        <InputLabel id={`staff-${apt.id}`}>Assign</InputLabel>
                        <Select
                          labelId={`staff-${apt.id}`}
                          label="Assign"
                          value={apt.assignedStaff?.id || ''}
                          onChange={(e) => handleStaffChange(apt.id, e.target.value)}
                        >
                          <MenuItem value="">
                            <em>Unassigned</em>
                          </MenuItem>
                          {staff.map((s) => (
                            <MenuItem key={s.id} value={s.id}>
                              {s.username}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => handleConfirm(apt.id)} disabled={apt.status === 'confirmed'}>
                        Confirm
                      </Button>
                      <Button size="small" color="warning" onClick={() => openReschedule(apt)}>
                        Reschedule
                      </Button>
                      <Button size="small" color="error" onClick={() => handleCancel(apt.id)} disabled={apt.status === 'canceled'}>
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          All appointments
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date & time</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Staff</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((apt) => (
              <TableRow key={`all-${apt.id}`} hover>
                <TableCell>{new Date(apt.appointmentDate).toLocaleString()}</TableCell>
                <TableCell>{apt.patient?.username || '—'}</TableCell>
                <TableCell>
                  <Chip size="small" label={apt.status} color={statusColor(apt.status)} />
                </TableCell>
                <TableCell>{apt.assignedStaff?.username || '—'}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="Delete appointment"
                    color="error"
                    size="small"
                    onClick={() => setDeleteTarget(apt)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={Boolean(reschedule)} onClose={() => setReschedule(null)} fullWidth maxWidth="xs">
        <DialogTitle>Reschedule appointment</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="New date & time"
            type="datetime-local"
            fullWidth
            value={rescheduleAt}
            onChange={(e) => setRescheduleAt(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReschedule(null)}>Close</Button>
          <Button variant="contained" onClick={submitReschedule}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete appointment?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            This permanently removes the appointment
            {deleteTarget
              ? ` on ${new Date(deleteTarget.appointmentDate).toLocaleString()}${deleteTarget.patient?.username ? ` (${deleteTarget.patient.username})` : ''}`
              : ''}
            . This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDeleteAppointment}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
