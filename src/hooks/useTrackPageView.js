import { useEffect } from 'react';
import { trackView } from '../api/analytics';

export function useTrackPageView(payload) {
  useEffect(() => {
    trackView(payload);
  }, [payload.page, payload.projectId, payload.title]);
}
