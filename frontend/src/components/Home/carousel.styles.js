// src/components/Carousel/carousel.styles.js

const styles = {
  root: {
    overflow: 'hidden',
    position: 'relative',
  },
  track: (length) => ({
    display: 'flex',
    transition: 'transform 0.5s ease',
    width: `${length * 100}%`,
  }),
  slide: {
    minWidth: '100%',
    boxSizing: 'border-box',
    flexShrink: 0,
  },
  controls: {
    mt: 2,
  },
};

export default styles;