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
  CircularProgress,
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
import dashStyles from "./dashboard.styles";

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
    if (
      !window.confirm(`
        Remove staff account "${member.username}"? Assigned appointments will become unassigned.`)
    ) {
      return;
    }

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

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 3 }}>
        <CircularProgress size={28} sx={{ color: "#0db1ad" }} />
        <Typography sx={{ color: "#5a6b6b" }}>Loading…</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={dashStyles.pageHeader}>
        <Box>
          <Typography component="h1" sx={dashStyles.pageTitle}>
            Users &amp; staff
          </Typography>
          <Typography sx={dashStyles.pageSubtitle}>
            Manage your clinic team and registered patients.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={dashStyles.alert}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Typography sx={dashStyles.sectionTitle}>Staff team</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Add clinic staff here. They can log in with the credentials you set.
      </Typography>

      <Paper
        elevation={0}
        sx={{ ...dashStyles.card, mb: 4 }}
        component="form"
        onSubmit={handleAddStaff}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: "#0f2a2a", mb: 2 }}
        >
          Add staff member
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "flex-start",
          }}
        >
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
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            sx={{ mt: 0.5, ...dashStyles.primaryBtn }}
          >
            Add staff
          </Button>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ ...dashStyles.card, mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={dashStyles.tableHeaderCell}>Joined</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Username</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Email</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Phone</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Status</TableCell>
              <TableCell align="right" sx={dashStyles.tableHeaderCell}>
                Manage
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary">No staff yet.</Typography>
                </TableCell>
              </TableRow>
            )}
            {staff.map((s) => (
              <TableRow key={s.id} hover>
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
                    aria-label="Edit"
                    size="small"
                    onClick={() => openEdit(s)}
                    color="primary"
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
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
      </Paper>

      <Typography sx={dashStyles.sectionTitle}>All accounts</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Every registered user. You can assign roles and activate/deactivate
        accounts.
      </Typography>

      <Paper elevation={0} sx={dashStyles.card}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={dashStyles.tableHeaderCell}>Joined</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Username</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Email</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Phone</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Role</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Status</TableCell>
              <TableCell sx={dashStyles.tableHeaderCell}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography color="text.secondary">No users.</Typography>
                </TableCell>
              </TableRow>
            )}
            {allUsers.map((u) => (
              <TableRow key={u.id} hover>
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
      </Paper>

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
          <Button
            variant="contained"
            onClick={submitEdit}
            disabled={saving}
            sx={dashStyles.primaryBtn}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
