// src/pages/About/About.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
} from '@mui/material';
import styles from './about.styles';

export default function About() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    fetch('/data/team.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load team data');
        return res.json();
      })
      .then(setTeam)
      .catch(() => setTeam([]));
  }, []);

  return (
    <Container sx={styles.container}>
      <Typography variant="h4" component="h2" sx={styles.heading}>
        About BrightSmile
      </Typography>

      <Typography variant="body1" sx={styles.description}>
        BrightSmile is a student-built project for a responsive dental clinic website.
        Our team combines UX, React, and frontend best practices to deliver a clean,
        accessible experience.
      </Typography>

      <Box sx={styles.teamSection}>
        <Typography variant="h5" component="h3" sx={styles.teamHeading}>
          Meet the Team
        </Typography>

        {team.length === 0 ? (
          <Box sx={styles.loader}>
            <CircularProgress />
          </Box>
        ) : (
          team.map((member) => (
            <Box key={member.id} sx={styles.card}>
              <Box
                component="img"
                src={member.photo}
                alt={member.name}
                sx={styles.photo}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" component="h4" sx={styles.name}>
                  {member.name}
                </Typography>
                <Typography sx={styles.role}>{member.role}</Typography>
                <Typography sx={styles.bio}>{member.bio}</Typography>
                <Typography sx={styles.id}>
                  <strong>Student ID:</strong> {member.studentId}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
}