// src/components/Home/Carousel.js
import React, { useRef, useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import useInterval from '../../hooks/useInterval';
import styles from './carousel.styles';

export default function Carousel({
  children,
  interval = 4000,
  autoPlay = true,
  pauseOnHover = true,
  showArrows = true,
  showDots = true,
  className = '',
}) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const items = React.Children.toArray(children);
  const len = items.length;

  const goTo = (i) => setIndex(((i % len) + len) % len);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useInterval(() => {
    if (len > 1 && !hovering) next();
  }, autoPlay ? interval : null);

  useEffect(() => {
    const el = trackRef.current;
    if (el) {
      el.style.transform = `translateX(-${index * 100}%)`;
    }
  }, [index]);

  if (len === 0) return null;

  return (
    <Box
      className={className}
      onMouseEnter={() => pauseOnHover && setHovering(true)}
      onMouseLeave={() => pauseOnHover && setHovering(false)}
      sx={styles.root}
      aria-roledescription="carousel"
    >
      <Box sx={styles.viewport}>
        <Box sx={styles.viewportInner}>
          <Box ref={trackRef} sx={styles.track(len)}>
            {items.map((child, i) => (
              <Box key={i} sx={styles.slide} aria-hidden={i !== index}>
                {child}
              </Box>
            ))}
          </Box>

          {showArrows && len > 1 && (
            <>
              <IconButton
                onClick={prev}
                aria-label="Previous slide"
                sx={{ ...styles.arrow, ...styles.arrowLeft }}
              >
                <ArrowBackIosNew fontSize="small" />
              </IconButton>
              <IconButton
                onClick={next}
                aria-label="Next slide"
                sx={{ ...styles.arrow, ...styles.arrowRight }}
              >
                <ArrowForwardIos fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      </Box>

      {showDots && len > 1 && (
        <Box sx={styles.controls} role="tablist" aria-label="Slide indicators">
          {items.map((_, i) => (
            <Box
              key={i}
              component="button"
              role="tab"
              aria-label={`Go to slide ${i + 1}`}
              aria-selected={i === index}
              onClick={() => goTo(i)}
              sx={styles.dot(i === index)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
