import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  TextField,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  fetchAdminUsers,
  fetchAdminStaff,
  createAdminStaff,
  patchAdminStaff,
  deleteAdminStaff,
  patchAdminUserRole,
  patchAdminUserActive,
} from "../../services/api";
import PasswordField from "../../components/PasswordField";

export default function Users() {
  const [allUsers, setAllUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPassword, setEditPassword] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [users, staffList] = await Promise.all([
        fetchAdminUsers(),
        fetchAdminStaff(),
      ]);
      setAllUsers(users);
      setStaff(staffList);
    } catch (e) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createAdminStaff({
        username: newUsername.trim(),
        email: newEmail.trim(),
        phone: newPhone.trim(),
        password: newPassword,
      });
      setNewUsername("");
      setNewEmail("");
      setNewPhone("");
      setNewPassword("");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (member) => {
    setEditOpen(member);
    setEditUsername(member.username);
    setEditEmail(member.email);
    setEditPhone(member.phone || "");
    setEditPassword("");
  };

  const submitEdit = async () => {
    if (!editOpen) return;
    setSaving(true);
    setError("");
    try {
      const body = {
        username: editUsername.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
      };
      if (editPassword.trim()) body.password = editPassword;

      await patchAdminStaff(editOpen.id, body);
      setEditOpen(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeStaff = async (member) => {
    if (!window.confirm(`Remove staff account "${member.username}"?`)) return;

    setError("");
    try {
      await deleteAdminStaff(member.id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRoleChange = async (userId, role) => {
    setError("");
    try {
      await patchAdminUserRole(userId, { role });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleActive = async (user) => {
    const nextStatus = !user.isActive;
    const action = nextStatus ? "activate" : "deactivate";

    if (
      !window.confirm(`Are you sure you want to ${action} "${user.username}"?`)
    ) {
      return;
    }

    setError("");
    try {
      await patchAdminUserActive(user.id, nextStatus);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Typography>Loading…</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Users &amp; staff
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
        Staff team
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Add clinic staff here. They can log in with the credentials you set.
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }} component="form" onSubmit={handleAddStaff}>
        <Typography variant="subtitle2" gutterBottom>
          Add staff member
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <TextField
            size="small"
            label="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            required
          />
          <TextField
            size="small"
            label="Email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <TextField
            size="small"
            label="Phone"
            type="tel"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            required
            helperText="7+ digits"
          />
          <PasswordField
            size="small"
            label="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            helperText="8+ chars, number & special character"
            autoComplete="new-password"
          />
          <Button type="submit" variant="contained" disabled={saving}>
            Add staff
          </Button>
        </Box>
      </Paper>

      <Table size="small" sx={{ mb: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell>Joined</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Manage</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {staff.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No staff yet.</TableCell>
            </TableRow>
          )}

          {staff.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{new Date(s.createdAt).toLocaleString()}</TableCell>
              <TableCell>{s.username}</TableCell>
              <TableCell>{s.email}</TableCell>
              <TableCell>{s.phone || "—"}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={s.isActive ? "Active" : "Deactivated"}
                  color={s.isActive ? "success" : "default"}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => openEdit(s)}
                  color="primary"
                >
                  <EditOutlinedIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => removeStaff(s)}
                  color="error"
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography variant="h6" gutterBottom>
        All accounts
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Every registered user. You can assign roles and activate/deactivate
        accounts.
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Joined</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {allUsers.length === 0 && (
            <TableRow>
              <TableCell colSpan={7}>No users.</TableCell>
            </TableRow>
          )}

          {allUsers.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.phone || "—"}</TableCell>
              <TableCell>
                <Select
                  size="small"
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                >
                  <MenuItem value="patient">patient</MenuItem>
                  <MenuItem value="staff">staff</MenuItem>
                  <MenuItem value="admin">admin</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={u.isActive ? "Active" : "Deactivated"}
                  color={u.isActive ? "success" : "default"}
                />
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  color={u.isActive ? "error" : "success"}
                  onClick={() => handleToggleActive(u)}
                >
                  {u.isActive ? "Deactivate" : "Activate"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={Boolean(editOpen)}
        onClose={() => setEditOpen(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Edit staff</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Username"
            fullWidth
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Phone"
            type="tel"
            fullWidth
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
          />
          <PasswordField
            margin="dense"
            label="New password (optional)"
            fullWidth
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
            helperText="Leave blank to keep current password"
            autoComplete="new-password"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(null)}>Cancel</Button>
          <Button variant="contained" onClick={submitEdit} disabled={saving}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
