// src/pages/Register/Register.js
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Fade,
} from '@mui/material';
import PasswordField from '../../components/PasswordField';
import { postRegister } from '../../services/api';
import styles from './register.styles';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[0-9]/.test(password)) return 'Password must include at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must include at least one special character';
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    try {
      await postRegister(form);
      alert(`Welcome, ${form.username}!`);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={styles.root}>
      <Fade in timeout={500}>
        <Paper elevation={3} sx={styles.paper}>
          <Typography variant="h4" component="h2" sx={styles.title}>
            Register
          </Typography>

          <Box component="form" onSubmit={handleRegister} sx={styles.form}>
            <TextField
              label="Username"
              name="username"
              variant="outlined"
              fullWidth
              value={form.username}
              onChange={handleChange}
              required
              sx={styles.input}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              value={form.email}
              onChange={handleChange}
              required
              sx={styles.input}
            />
            <TextField
              label="Phone number"
              name="phone"
              type="tel"
              variant="outlined"
              fullWidth
              value={form.phone}
              onChange={handleChange}
              required
              helperText="Required — at least 7 digits"
              sx={styles.input}
            />
            <PasswordField
              label="Password"
              name="password"
              variant="outlined"
              fullWidth
              value={form.password}
              onChange={handleChange}
              required
              helperText="Min 8 characters, include a number and special character"
              sx={styles.input}
              autoComplete="new-password"
            />

            {error && (
              <Typography sx={styles.error}>{error}</Typography>
            )}

            <Button type="submit" fullWidth sx={styles.button}>
              Create Account
            </Button>
          </Box>

          <Typography sx={styles.loginText}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" sx={styles.loginLink}>
              Log In
            </Link>
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
}
