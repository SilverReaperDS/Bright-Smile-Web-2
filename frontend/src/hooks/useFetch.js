// src/hooks/useFetch.js

import { useState, useEffect, useRef, useCallback } from 'react';

export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(fetcher));
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const load = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    abortRef.current?.abort?.();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await fetcher({ signal: controller.signal, args });
      if (!controller.signal.aborted) {
        setData(result);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // ignore abort
      } else {
        setError(err);
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (!fetcher) return;
    load();
    return () => {
      abortRef.current?.abort?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const refetch = useCallback(() => load(), [load]);

  return { data, loading, error, refetch };
}