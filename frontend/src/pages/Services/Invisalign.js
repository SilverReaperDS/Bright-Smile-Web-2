// src/pages/Invisalign.js
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

export default function Invisalign() {
  return (
    <Box sx={styles.section}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" sx={styles.heading}>
          Invisalign Clear Aligners in Nablus
        </Typography>

        <Typography paragraph>
          If you’re here, chances are you’re one of the many people dealing with crooked teeth, gaps, or a misaligned bite. These issues can affect your confidence, your ability to chew, and even your oral hygiene.
        </Typography>

        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
          Our Solution
        </Typography>
        <Typography paragraph>
          Thanks to modern dental technology, Invisalign offers a nearly invisible alternative to traditional braces. At our Nablus clinic, we’ve helped many patients achieve beautifully straight smiles using this advanced system.
        </Typography>
        <Typography paragraph>
          Invisalign aligners are ideal for mild to moderate bite and alignment issues. They’re clear, comfortable, and custom-designed to gently shift your teeth into place. Invisalign is perfect for:
        </Typography>
        <List sx={styles.list}>
          {[
            'Correcting misaligned bites',
            'Realigning teeth that have shifted',
            'Closing gaps between teeth',
            'Creating a straight, uniform smile',
          ].map((item, i) => (
            <ListItem key={i} sx={styles.listItem}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>

        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
          Why Invisalign Over Metal Braces?
        </Typography>
        <Typography paragraph>
          If your teeth are crowded or misaligned, Invisalign can help — discreetly and comfortably. It’s a great fit if you:
        </Typography>
        <List sx={styles.list}>
          {[
            'Want straight teeth in 12–18 months',
            'Have bite or alignment issues',
            'Enjoy foods that might damage metal braces',
            'Prefer a subtle, nearly invisible treatment',
            'Want long-lasting results',
          ].map((item, i) => (
            <ListItem key={i} sx={styles.listItem}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>

        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
          Advantages of Invisalign
        </Typography>
        <Typography paragraph>
          Invisalign aligners offer the same results as braces without the hassle of wires and brackets. You can remove them to eat, brush, and floss — making oral hygiene easier and more effective.
        </Typography>
        <Typography paragraph>
          With consistent wear, most patients see results in about 12 months. Invisalign is a flexible, lifestyle-friendly way to achieve a healthier, straighter smile.
        </Typography>

        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
          Why Choose Us for Invisalign in Nablus?
        </Typography>
        <Typography paragraph>
          Our experienced team has helped countless patients in Nablus transform their smiles with Invisalign. We don’t just provide aligners — we offer expert guidance, personalized care, and ongoing support throughout your journey.
        </Typography>
        <Typography paragraph>
          You’ll visit us every six weeks to ensure your treatment is progressing smoothly. We’re here to answer your questions and make sure you’re on track for success.
        </Typography>

        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
          Benefits of Invisalign Clear Braces
        </Typography>

        <Typography variant="h6" component="h3" sx={{ mt: 3 }}>
          Bite Correction
        </Typography>
        <Typography paragraph>Invisalign aligners help correct:</Typography>
        <List sx={styles.list}>
          {[
            'Crowded teeth: Creates space for healthier growth',
            'Overbite: Reduces discomfort and risk of TMD',
            'Underbite: Eases jaw pain and improves alignment',
            'Gaps: Prevents uneven wear and improves aesthetics',
          ].map((item, i) => (
            <ListItem key={i} sx={styles.listItem}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" component="h3" sx={{ mt: 3 }}>
          Perfect for Adults and Teens
        </Typography>
        <List sx={styles.list}>
          {[
            'Discreet — no visible brackets or wires',
            'No broken brackets or emergency visits',
            'Safe for sports — remove during games',
            'Eat your favorite foods without worry',
          ].map((item, i) => (
            <ListItem key={i} sx={styles.listItem}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" component="h3" sx={{ mt: 3 }}>
          Improved Oral Health
        </Typography>
        <List sx={styles.list}>
          {[
            'Reduces plaque buildup and cavities',
            'Supports healthy gums and jaw alignment',
            'Prevents TMJ pain and headaches',
            'Protects against gum disease and inflammation',
          ].map((item, i) => (
            <ListItem key={i} sx={styles.listItem}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>

        <Typography variant="h5" component="h2" sx={{ mt: 5, mb: 2 }}>
          How Invisalign Works
        </Typography>
        {[
          {
            step: '1. Consultation & Digital Imaging',
            desc: 'We begin with a full consultation and digital impressions of your teeth. You’ll see a 3D preview of your future smile and we’ll map out your treatment plan.',
          },
          {
            step: '2. Custom Aligner Fabrication',
            desc: 'Your aligners are custom-made to fit your teeth and shift them gradually. You’ll wear each set for 2–4 weeks before switching to the next.',
          },
          {
            step: '3. Daily Wear',
            desc: 'Wear your aligners 22 hours a day — even while sleeping. Only remove them to eat, brush, or play sports.',
          },
          {
            step: '4. Progression & Retention',
            desc: 'As you move through each set, your teeth will align more with every step. After your final aligner, we’ll provide a custom retainer to maintain your results long-term.',
          },
        ].map((item, i) => (
          <Box key={i} sx={{ mb: 3 }}>
            <Typography variant="h6" component="h3">
              {item.step}
            </Typography>
            <Typography>{item.desc}</Typography>
          </Box>
        ))}

        <Typography variant="h5" component="h2" sx={{ mt: 5, mb: 2 }}>
          Common Invisalign Questions
        </Typography>
        {[
          {
            q: 'Who Is an Ideal Candidate?',
            a: 'Invisalign is great for teens and adults with mild to moderate bite issues. You’re likely a good candidate if:',
            list: [
              'All permanent teeth are in',
              'You can wear aligners 22 hours/day',
              'You maintain good oral hygiene',
              'Any prior dental work is complete',
              'You’re committed to following treatment instructions',
            ],
          },
          {
            q: 'Why Choose a Professional Dentist?',
            a: 'Invisalign is a medical treatment that requires expert supervision. We’ll monitor your progress every 4–6 weeks to ensure safe, effective results. Mail-order aligners can’t offer the same level of care — and may even cause harm.',
          },
          {
            q: 'How Much Does Invisalign Cost?',
            a: 'Costs vary depending on:',
            list: ['Treatment length', 'Insurance coverage', 'Number and severity of issues'],
            followUp:
              'We’ll provide a personalized estimate during your consultation and discuss financing options if needed.',
          },
          {
            q: 'How Long Does Treatment Take?',
            a: 'Most patients complete treatment in about 12 months. Some see results in as little as 6 months, while others may need more time depending on complexity. We’ll give you a tailored timeline after your exam.',
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

