import { useEffect, useState } from 'react';
import { fetchStats } from '../api/analytics';

const initialState = {
  data: null,
  status: 'loading',
  error: '',
};

export function useDashboardStats(refreshInterval = 15000) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const data = await fetchStats();

        if (!isMounted) {
          return;
        }

        setState({
          data,
          status: 'success',
          error: '',
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setState({
          data: null,
          status: 'error',
          error: error.message,
        });
      }
    }

    loadStats();
    const interval = window.setInterval(loadStats, refreshInterval);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [refreshInterval]);

  return state;
}
