import { useState, useCallback } from 'react';
import { apiFetch } from '../api/apiClient';

export function useHttp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch(endpoint, options);
      return data;
    } catch (err) {
      setError(err.message || 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
}