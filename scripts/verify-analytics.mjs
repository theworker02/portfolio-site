import fs from 'node:fs/promises';
import path from 'node:path';

const tempDbPath = path.resolve(process.cwd(), 'tmp', 'verify-analytics.sqlite');
process.env.ANALYTICS_DB_PATH = tempDbPath;

const { startAnalyticsServer } = await import('../server/app.js');

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${url}`);
  }
}

const port = 8791;
const baseUrl = `http://127.0.0.1:${port}`;
await fs.mkdir(path.dirname(tempDbPath), { recursive: true });
const server = await startAnalyticsServer(port);

try {
  await postJson(`${baseUrl}/api/view`, {
    visitorId: 'test-visitor',
    page: '/dashboard',
    title: 'Dashboard',
  });

  await postJson(`${baseUrl}/api/click`, {
    visitorId: 'test-visitor',
    page: '/projects/mini-wiki',
    projectId: 'mini-wiki',
    title: 'Mini Wiki',
    target: 'demo',
    label: 'Launch demo',
  });

  const statsResponse = await fetch(`${baseUrl}/api/stats`);

  if (!statsResponse.ok) {
    throw new Error('Unable to read analytics stats.');
  }

  const stats = await statsResponse.json();

  if (!stats?.totals) {
    throw new Error('Stats response is missing totals.');
  }

  process.stdout.write(JSON.stringify(stats, null, 2));
  process.stdout.write('\n');
} finally {
  if (server.listening) {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  await fs.rm(tempDbPath, { force: true });
}
