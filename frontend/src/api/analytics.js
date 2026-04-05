const configuredApiBase = import.meta.env.VITE_API_URL?.trim();

export function getApiBaseUrl() {
  if (configuredApiBase) {
    return configuredApiBase.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocalhost) {
      return 'http://localhost:5000';
    }
  }

  return '';
}

function getEndpoint(pathname) {
  const apiBase = getApiBaseUrl();
  return apiBase ? `${apiBase}${pathname}` : '';
}

function getVisitorId() {
  if (typeof window === 'undefined') {
    return 'server-render';
  }

  const storageKey = 'portfolio-visitor-id';
  const existingId = window.localStorage.getItem(storageKey);

  if (existingId) {
    return existingId;
  }

  const visitorId = `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(storageKey, visitorId);
  return visitorId;
}

function buildPayload(payload) {
  return {
    visitorId: getVisitorId(),
    page: payload.page || (typeof window !== 'undefined' ? window.location.pathname : '/'),
    title: payload.title || '',
    projectId: payload.projectId || '',
    target: payload.target || '',
    label: payload.label || '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    metadata: payload.metadata || null,
  };
}

function sendEvent(endpoint, payload) {
  const url = getEndpoint(endpoint);

  if (!url) {
    return Promise.resolve({ skipped: true });
  }

  const body = JSON.stringify(buildPayload(payload));

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([body], { type: 'application/json' });

    if (navigator.sendBeacon(url, blob)) {
      return Promise.resolve({ queued: true });
    }
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
    keepalive: true,
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Analytics request failed.');
    }

    return response.json().catch(() => ({}));
  });
}

export function trackView(payload) {
  return sendEvent('/api/view', payload).catch(() => null);
}

export function trackClick(payload) {
  return sendEvent('/api/click', payload).catch(() => null);
}

export async function fetchStats() {
  const url = getEndpoint('/api/stats');

  if (!url) {
    throw new Error(
      'Analytics API is not configured. Set VITE_API_URL for production deployment.',
    );
  }

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Unable to load analytics statistics right now.');
  }

  return response.json();
}
