import { getApiBaseUrl } from './analytics';

function getContactEndpoint() {
  const apiBase = getApiBaseUrl();
  return apiBase ? `${apiBase}/api/contact` : '/api/contact';
}

export async function sendContactMessage(payload) {
  const response = await fetch(getContactEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Unable to send your message right now.');
  }

  return data;
}
