// src/pages/Cosmetic.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
  Button,
} from '@mui/material';
import styles from './shared.styles';

export default function Cosmetic() {
  return (
    <Box sx={styles.section}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" sx={styles.heading}>
          We Design Beautiful Enduring Smiles
        </Typography>

        <Typography variant="body1" sx={styles.paragraph}>
          Your teeth aren’t just for chewing — they tell a powerful story. A brilliant white smile enhances your appearance and boosts your confidence.
        </Typography>

        <Box sx={{ mb: 5 }}>
          <Typography paragraph>
            Our experienced dentists have helped countless patients with chips, cracks, gaps, discoloration, and more. Using advanced technology, we deliver stunning results — often in under a month.
          </Typography>
          <Typography paragraph>
            If you’re ready to improve your smile, Wagner Dental is here to help. We’ll work with you to design a lasting, radiant smile that reflects who you are.
          </Typography>
        </Box>

        <Box sx={{ mb: 5, backgroundColor: '#f9f9f9', p: 3, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" sx={styles.subheading}>
            Is Cosmetic Dentistry Right for You?
          </Typography>
          <List sx={styles.list}>
            {[
              'You want to smile confidently around friends and family',
              'You avoid social settings due to gaps or imperfections',
              'Your smile affects your self-esteem or mental health',
              'You face oral health challenges that impact daily life',
            ].map((item, i) => (
              <ListItem key={i} sx={styles.listItem}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
          <Typography sx={{ mt: 2 }}>
            If any of these sound like you, we can help. During your consultation, we’ll review your goals and create a personalized plan to restore your smile.
          </Typography>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Tailored Treatments for Every Smile
          </Typography>
          <Typography paragraph>
            Cosmetic dentistry isn’t one-size-fits-all. We offer a full suite of services, including:
          </Typography>
          <List sx={styles.list}>
            {['Crowns', 'Dental Bridges', 'Dental Implants', 'Teeth Whitening', 'Veneers'].map((item, i) => (
              <ListItem key={i} sx={styles.listItem}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
          <Typography sx={{ mt: 2 }}>
            No matter your needs, we’ll help you choose the right treatment to transform your smile and boost your confidence.
          </Typography>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Why Choose Wagner Dental?
          </Typography>
          <Typography>
            Our team combines decades of experience with cutting-edge technology to deliver long-lasting results. We treat every patient like family and ensure you feel at home from the moment you walk in.
          </Typography>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            Popular Cosmetic Treatments
          </Typography>
          {[
            {
              title: 'Teeth Whitening',
              content:
                'We use Opalescence Whitening — a professional system that penetrates enamel and breaks down stains for a brilliant white smile. It’s far more effective than over-the-counter products.',
            },
            {
              title: 'Porcelain Veneers',
              content:
                'In just two appointments, we can design and place porcelain veneers to cover chips, cracks, and gaps. They’re custom-made to match your natural teeth and give you a stunning smile.',
              steps: [
                'We take impressions of your teeth',
                'Design veneers to match shape and color',
                'Gently prepare your teeth',
                'Place the veneers — and reveal your new smile',
              ],
            },
            {
              title: 'Dental Bonding',
              content:
                'A more affordable alternative to veneers, bonding uses composite resin to reshape and repair teeth. It’s ideal for minor chips, cracks, or gaps.',
            },
            {
              title: 'Dental Crowns',
              content:
                'Using CEREC technology, we scan, design, and 3D-print your crown in a single visit. You’ll leave with a fully restored, natural-looking tooth — no waiting required.',
            },
          ].map((treatment, i) => (
            <Box key={i} sx={{ mb: 4 }}>
              <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                {treatment.title}
              </Typography>
              <Typography paragraph>{treatment.content}</Typography>
              {treatment.steps && (
                <List sx={{ listStyleType: 'decimal', pl: 3 }}>
                  {treatment.steps.map((step, j) => (
                    <ListItem key={j} sx={styles.listItem}>
                      <ListItemText primary={step} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          ))}
        </Box>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            Common Questions
          </Typography>
          {[
            {
              q: 'Are All Treatments Performed In-House?',
              a: 'Yes! Our Las Vegas office is equipped with advanced tools like CEREC for same-day crowns, Zoom! Whitening, and implant dentistry — all under one roof.',
            },
            {
              q: 'How Affordable Are Cosmetic Treatments?',
              a: 'Pricing depends on the service, treatment time, and insurance coverage. We offer free consultations to help you find the most cost-effective option.',
            },
            {
              q: 'What Results Can I Expect?',
              a: '',
              list: [
                'Zoom Whitening: Up to 8 shades whiter in one visit',
                'Implants: Completed in 3 phases over a few months',
                'Invisalign: 6–18 months depending on alignment',
                'Crowns & Veneers: Same-day results with CEREC',
              ],
            },
            {
              q: 'How Long Will My Results Last?',
              a: 'With proper care, your results can last for years. Veneers, crowns, and implants are long-term solutions. Whitening typically lasts up to 2 years depending on your habits.',
            },
          ].map((faq, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {faq.q}
              </Typography>
              {faq.a && <Typography>{faq.a}</Typography>}
              {faq.list && (
                <List sx={styles.list}>
                  {faq.list.map((item, j) => (
                    <ListItem key={j} sx={styles.listItem}>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          ))}
        </Box>

        <Box sx={styles.calloutBox}>
          <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
            Let’s Design Your Dream Smile
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Schedule your free cosmetic consultation with Wagner Dental today and take the first step toward a confident, radiant smile.
          </Typography>
          <Button
            component={RouterLink}
            to="/contact"
            variant="contained"
            sx={styles.buttonPrimary}
          >
            Book Consultation
          </Button>
        </Box>
      </Container>
    </Box>
  );
}