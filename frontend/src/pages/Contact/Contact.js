// src/pages/Contact/Contact.js
import React from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import styles from './contact.styles';

export default function Contact() {
  return (
    <Box sx={styles.root}>
      <Container maxWidth="sm">
        <Box sx={styles.header}>
          <Typography variant="h4" component="h1" id="contact-heading" sx={styles.title}>
            Contact Us
          </Typography>
          <Typography id="contact-desc" sx={styles.subtitle}>
            We’d love to hear from you. Fill out the form and we’ll get back to you shortly.
          </Typography>
        </Box>

        <Box
          component="form"
          role="form"
          aria-describedby="contact-desc"
          noValidate
          onSubmit={(e) => e.preventDefault()}
          sx={styles.form}
        >
          <TextField
            id="name"
            name="name"
            label="Your Name"
            placeholder="Your Name"
            variant="outlined"
            required
            fullWidth
            autoComplete="name"
          />
          <TextField
            id="email"
            name="email"
            label="Your Email"
            placeholder="Your Email"
            type="email"
            variant="outlined"
            required
            fullWidth
            autoComplete="email"
          />
          <TextField
            id="phone"
            name="phone"
            label="Phone Number (optional)"
            placeholder="Phone Number (optional)"
            type="tel"
            variant="outlined"
            fullWidth
            autoComplete="tel"
          />
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
          />

          <Box sx={styles.buttonWrapper}>
            <Button
              type="submit"
              variant="contained"
              aria-label="Send message"
              sx={styles.button}
            >
              Send Message
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}