// src/hooks/useInterval.js

import { useEffect, useRef } from 'react';

export default function useInterval(callback, delay) {
  const savedRef = useRef();

  // Remember latest callback
  useEffect(() => {
    savedRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null || delay === undefined) return;
    const tick = () => savedRef.current && savedRef.current();
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}