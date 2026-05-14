// src/pages/DentalImplants.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import styles from './shared.styles';

export default function DentalImplants() {
  return (
    <Box sx={styles.section}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" sx={styles.heading}>
          Restore Your Smile with Dental Implants in Nablus
        </Typography>

        <Typography paragraph>
          Do you have missing teeth that make your life difficult? Are you tired of hiding your smile or struggling to brush around a tooth gap? Our talented team of dentists in Nablus can help!
        </Typography>
        <Typography paragraph>
          Missing teeth can happen for many reasons: trauma, poor oral hygiene, gum disease, weak jawbone, or age. Thanks to modern dental technology, you don’t have to live with gaps in your smile. Dental implants are a powerful, long-lasting solution.
        </Typography>
        <Typography paragraph>
          If you’re ready to take action, we can help you restore your teeth with dental implants — a restoration that promotes total oral health and can last a lifetime.
        </Typography>

        <Typography variant="h5" component="h2" sx={{ mt: 5, mb: 2 }}>
          Worried About Your Missing Teeth?
        </Typography>
        <Typography paragraph>
          As we age, our teeth naturally wear down. Sometimes this leads to tooth loss. Other times, disease or decay requires removal. Many people lose teeth — it’s nothing to be ashamed of.
        </Typography>
        <Typography paragraph>
          But missing teeth can cause more than embarrassment. They can lead to:
        </Typography>
        <List sx={styles.list}>
          {[
            'Difficulty maintaining oral hygiene',
            'Jawbone shrinkage',
            'Lower self-esteem',
            'Speech difficulties',
            'Eating challenges and limited diet',
          ].map((item, i) => (
            <ListItem key={i} sx={styles.listItem}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
        <Typography paragraph>
          Left untreated, these issues can lead to more tooth loss and even systemic health problems. Our highly trained dentists in Nablus are here to help with advanced dental implant solutions.
        </Typography>

        <Typography variant="h5" component="h2" sx={{ mt: 5, mb: 2 }}>
          Why Choose Dental Implants?
        </Typography>
        <Typography paragraph>
          Dental implants are the most durable and natural-feeling tooth replacement available. Unlike traditional restorations that only replace the visible part of the tooth, implants also restore the root.
        </Typography>
        <Typography paragraph>
          Because implants are anchored into your jawbone, they help preserve bone density and prevent your jaw from shrinking. They also stop neighboring teeth from shifting and support your overall oral health.
        </Typography>

        <Typography variant="h5" component="h2" sx={{ mt: 5, mb: 2 }}>
          Why Choose Us?
        </Typography>
        <Typography paragraph>
          Our practice has been helping restore smiles in Nablus for decades. We specialize in cosmetic dentistry, including dental implants, and our team has advanced training that goes beyond standard dental education.
        </Typography>
        <Typography paragraph>
          Let us use our expertise to replace your missing teeth and help you feel confident sharing your smile again.
        </Typography>

        <Box
          component="blockquote"
          sx={{
            fontStyle: 'italic',
            borderLeft: '4px solid #0db1ad',
            pl: 2,
            my: 4,
            color: '#555',
          }}
        >
          “I have now gotten over my anxiety regarding the dentist. This place rocks — everyone in my family goes here. They do a great job helping keep my smile beautiful. Thank you.”
        </Box>

        <Typography variant="h5" component="h2" sx={{ mt: 5, mb: 3 }}>
          Dental Implants FAQ
        </Typography>

        {[
          {
            q: 'How Much Do Dental Implants Cost?',
            a: 'The cost depends on:',
            list: [
              'How many implants you need',
              'Type of implant (regular or mini)',
              'Type of restoration (crown, bridge, or denture)',
              'Any additional treatments (bone graft, gum therapy)',
            ],
            followUp:
              'We’ll provide a detailed estimate during your consultation. We also offer flexible financing options to make treatment affordable.',
          },
          {
            q: 'Are Dental Implants Painful?',
            a: 'You may feel some discomfort after surgery, but implants are designed to feel as natural and pain-free as your own teeth. We’ll provide pain relief options and monitor your healing closely.',
          },
          {
            q: 'How Long Do Implants Last?',
            a: 'The titanium implant can last 25+ years. The crown or denture on top may last 5–15 years depending on wear. With good hygiene and regular checkups, your implants can last a lifetime.',
          },
          {
            q: 'Am I a Good Candidate?',
            a: 'Ideal candidates have:',
            list: ['Healthy gums', 'Strong bone density', 'Enough space in the jaw'],
            followUp:
              'If you have gum disease, bone loss, or other concerns, we may recommend a bone graft or mini implant to support your treatment.',
          },
          {
            q: 'How Should I Prepare?',
            a: 'Keep your mouth clean and healthy. Brush and floss regularly, and avoid habits like smoking or excessive alcohol. If you suspect any oral health issues, visit us for a checkup before your implant procedure.',
          },
          {
            q: 'What About Aftercare?',
            a: 'Healing takes a few months. Follow our aftercare instructions, be gentle around the implant site, and use ice or pain relievers as needed. Once healed, we’ll place your final crown or bridge — and you’ll care for it just like a natural tooth.',
          },
        ].map((faq, i) => (
          <Box key={i} sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {faq.q}
            </Typography>
            <Typography paragraph>{faq.a}</Typography>
            {faq.list && (
              <List sx={styles.list}>
                {faq.list.map((item, j) => (
                  <ListItem key={j} sx={styles.listItem}>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            )}
            {faq.followUp && <Typography paragraph>{faq.followUp}</Typography>}
          </Box>
        ))}

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