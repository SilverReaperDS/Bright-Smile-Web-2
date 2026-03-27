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
import { postRegister } from '../../services/api';
import styles from './register.styles';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
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
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              value={form.password}
              onChange={handleChange}
              required
              sx={styles.input}
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