// src/pages/Login/Login.js
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
import { postLogin } from '../../services/api';
import styles from './login.styles';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await postLogin({ username, password });
      alert(`Welcome, ${username}!`);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={styles.root}>
      <Fade in timeout={500}>
        <Paper elevation={3} sx={styles.paper}>
          <Typography variant="h4" component="h2" sx={styles.title}>
            Login
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={styles.form}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={styles.input}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={styles.input}
            />

            {error && (
              <Typography sx={styles.error}>{error}</Typography>
            )}

            <Button type="submit" fullWidth sx={styles.button}>
              Log In
            </Button>
          </Box>

          <Typography sx={styles.registerText}>
            Don&apos;t have an account?{' '}
            <Link component={RouterLink} to="/register" sx={styles.registerLink}>
              Register
            </Link>
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
}