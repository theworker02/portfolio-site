import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import cors from 'cors';
import express from 'express';
import nodemailer from 'nodemailer';
import initSqlJs from 'sql.js';
const configuredOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];
const contactInbox = process.env.CONTACT_TO_EMAIL || process.env.EMAIL_USER || 'matthewlooney5@gmail.com';
const contactRateWindowMs = 15 * 60 * 1000;
const contactRateLimit = 5;
const contactRequests = new Map();
const dbFilePath = process.env.ANALYTICS_DB_PATH
  ? path.resolve(process.cwd(), process.env.ANALYTICS_DB_PATH)
  : path.resolve(process.cwd(), 'data', 'analytics.sqlite');

let SQL;
let database;
let writeQueue = Promise.resolve();

function getSqlWasmPath(file) {
  return path.resolve(process.cwd(), 'node_modules', 'sql.js', 'dist', file);
}

function mapRows(result) {
  if (!result.length) {
    return [];
  }

  const [firstResult] = result;

  return firstResult.values.map((row) =>
    Object.fromEntries(firstResult.columns.map((column, index) => [column, row[index]])),
  );
}

async function persistDatabase() {
  if (!database) {
    return;
  }

  const binary = database.export();
  await fs.mkdir(path.dirname(dbFilePath), { recursive: true });
  await fs.writeFile(dbFilePath, Buffer.from(binary));
}

function queuePersist() {
  writeQueue = writeQueue.then(() => persistDatabase()).catch(() => persistDatabase());
  return writeQueue;
}

function runQuery(query, params = []) {
  database.run(query, params);
  return queuePersist();
}

function all(query, params = []) {
  return mapRows(database.exec(query, params));
}

function first(query, params = []) {
  return all(query, params)[0] || null;
}

async function initializeDatabase() {
  if (database) {
    return database;
  }

  SQL = await initSqlJs({
    locateFile: getSqlWasmPath,
  });

  try {
    const fileBuffer = await fs.readFile(dbFilePath);
    database = new SQL.Database(fileBuffer);
  } catch {
    database = new SQL.Database();
  }

  database.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitor_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      page TEXT NOT NULL,
      title TEXT,
      project_id TEXT,
      target TEXT,
      label TEXT,
      metadata TEXT,
      user_agent TEXT,
      referrer TEXT,
      created_at TEXT NOT NULL
    );
  `);

  database.run('CREATE INDEX IF NOT EXISTS idx_events_created_at ON events (created_at DESC);');
  database.run('CREATE INDEX IF NOT EXISTS idx_events_page ON events (page);');
  database.run('CREATE INDEX IF NOT EXISTS idx_events_project_id ON events (project_id);');
  database.run('CREATE INDEX IF NOT EXISTS idx_events_event_type ON events (event_type);');

  await queuePersist();
  return database;
}

async function insertEvent(event) {
  await initializeDatabase();

  await runQuery(
    `
      INSERT INTO events (
        visitor_id,
        event_type,
        page,
        title,
        project_id,
        target,
        label,
        metadata,
        user_agent,
        referrer,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      event.visitorId,
      event.eventType,
      event.page,
      event.title,
      event.projectId,
      event.target,
      event.label,
      event.metadata ? JSON.stringify(event.metadata) : '',
      event.userAgent,
      event.referrer,
      event.createdAt,
    ],
  );
}

async function getAnalyticsStats() {
  await initializeDatabase();

  const totals =
    first(
      `
        SELECT
          COUNT(DISTINCT visitor_id) AS siteVisits,
          SUM(CASE WHEN event_type = 'view' THEN 1 ELSE 0 END) AS pageViews,
          SUM(
            CASE
              WHEN event_type = 'click'
                AND target NOT IN ('demo', 'open-demo', 'fullscreen-demo', 'external-demo')
              THEN 1
              ELSE 0
            END
          ) AS projectClicks,
          SUM(
            CASE
              WHEN event_type = 'click'
                AND target IN ('demo', 'open-demo', 'fullscreen-demo', 'external-demo')
              THEN 1
              ELSE 0
            END
          ) AS demoLaunches
        FROM events
      `,
    ) || {};

  const topPages = all(
    `
      SELECT page, COUNT(*) AS views
      FROM events
      WHERE event_type = 'view'
      GROUP BY page
      ORDER BY views DESC, page ASC
      LIMIT 8
    `,
  );

  const topProjects = all(
    `
      SELECT
        project_id AS projectId,
        MAX(NULLIF(title, '')) AS title,
        SUM(CASE WHEN event_type = 'view' THEN 1 ELSE 0 END) AS views,
        SUM(CASE WHEN event_type = 'click' THEN 1 ELSE 0 END) AS clicks,
        SUM(
          CASE
            WHEN event_type = 'click'
              AND target IN ('demo', 'open-demo', 'fullscreen-demo', 'external-demo')
            THEN 1
            ELSE 0
          END
        ) AS demos
      FROM events
      WHERE project_id IS NOT NULL AND project_id != ''
      GROUP BY project_id
      ORDER BY views DESC, clicks DESC, project_id ASC
      LIMIT 8
    `,
  );

  const recentEvents = all(
    `
      SELECT
        event_type AS eventType,
        page,
        title,
        project_id AS projectId,
        target,
        label,
        created_at AS createdAt
      FROM events
      ORDER BY created_at DESC
      LIMIT 12
    `,
  );

  return {
    totals: {
      siteVisits: Number(totals.siteVisits || 0),
      pageViews: Number(totals.pageViews || 0),
      projectClicks: Number(totals.projectClicks || 0),
      demoLaunches: Number(totals.demoLaunches || 0),
    },
    topPages: topPages.map((page) => ({
      page: page.page,
      views: Number(page.views || 0),
    })),
    topProjects: topProjects.map((project) => ({
      projectId: project.projectId,
      title: project.title || project.projectId,
      views: Number(project.views || 0),
      clicks: Number(project.clicks || 0),
      demos: Number(project.demos || 0),
    })),
    recentEvents,
    generatedAt: new Date().toISOString(),
  };
}

function sanitizeString(value) {
  return typeof value === 'string' ? value.trim().slice(0, 240) : '';
}

function sanitizeEmail(value) {
  return typeof value === 'string' ? value.trim().slice(0, 160).toLowerCase() : '';
}

function sanitizeMessage(value) {
  return typeof value === 'string' ? value.trim().slice(0, 4000) : '';
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getClientIp(request) {
  const forwardedFor = request.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }

  return request.ip || request.socket.remoteAddress || 'unknown';
}

function cleanupRateLimitWindow(now) {
  for (const [ip, entry] of contactRequests.entries()) {
    if (now - entry.startedAt > contactRateWindowMs) {
      contactRequests.delete(ip);
    }
  }
}

function validateContactRateLimit(request) {
  const now = Date.now();
  cleanupRateLimitWindow(now);

  const ip = getClientIp(request);
  const existing = contactRequests.get(ip);

  if (!existing || now - existing.startedAt > contactRateWindowMs) {
    contactRequests.set(ip, { count: 1, startedAt: now });
    return { allowed: true };
  }

  if (existing.count >= contactRateLimit) {
    const retryAfterSeconds = Math.ceil((contactRateWindowMs - (now - existing.startedAt)) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  existing.count += 1;
  contactRequests.set(ip, existing);
  return { allowed: true };
}

function buildContactPayload(request) {
  return {
    name: sanitizeString(request.body.name).slice(0, 120),
    email: sanitizeEmail(request.body.email),
    message: sanitizeMessage(request.body.message),
  };
}

function validateContactPayload(payload) {
  if (!payload.name || !payload.email || !payload.message) {
    return 'Name, email, and message are required.';
  }

  if (!isValidEmail(payload.email)) {
    return 'Enter a valid email address.';
  }

  if (payload.message.length < 12) {
    return 'Message must be at least 12 characters long.';
  }

  return '';
}

function createMailer() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}

async function sendContactEmail(payload) {
  const transporter = createMailer();

  if (!transporter) {
    throw new Error('Email transport is not configured. Set EMAIL_USER and EMAIL_PASS in the backend environment.');
  }

  const escapedName = escapeHtml(payload.name);
  const escapedEmail = escapeHtml(payload.email);
  const escapedMessage = escapeHtml(payload.message);

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: contactInbox,
    replyTo: payload.email,
    subject: 'New Portfolio Contact Message',
    text: `New portfolio message\n\nName: ${payload.name}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}\n`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 16px;">New Portfolio Contact Message</h2>
        <p><strong>Name:</strong> ${escapedName}</p>
        <p><strong>Email:</strong> ${escapedEmail}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${escapedMessage}</p>
      </div>
    `,
  });
}

function buildEventPayload(request, eventType) {
  return {
    visitorId: sanitizeString(request.body.visitorId) || 'anonymous',
    eventType,
    page: sanitizeString(request.body.page) || '/',
    title: sanitizeString(request.body.title),
    projectId: sanitizeString(request.body.projectId),
    target: sanitizeString(request.body.target),
    label: sanitizeString(request.body.label),
    metadata:
      request.body.metadata && typeof request.body.metadata === 'object'
        ? request.body.metadata
        : null,
    userAgent: sanitizeString(request.headers['user-agent']),
    referrer: sanitizeString(request.body.referrer),
    createdAt: new Date().toISOString(),
  };
}

export function createServerApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || configuredOrigins.length === 0 || configuredOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error('Origin not allowed by backend.'));
      },
    }),
  );
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', async (_request, response) => {
    await initializeDatabase();
    response.json({
      ok: true,
      service: 'portfolio-backend',
      timestamp: new Date().toISOString(),
    });
  });

  app.post('/api/view', async (request, response) => {
    const payload = buildEventPayload(request, 'view');

    if (!payload.page) {
      response.status(400).json({ error: 'Page is required.' });
      return;
    }

    await insertEvent(payload);
    response.status(201).json({ ok: true });
  });

  app.post('/api/click', async (request, response) => {
    const payload = buildEventPayload(request, 'click');

    if (!payload.page || !payload.target) {
      response.status(400).json({ error: 'Page and target are required.' });
      return;
    }

    await insertEvent(payload);
    response.status(201).json({ ok: true });
  });

  app.post('/api/contact', async (request, response) => {
    const rateLimit = validateContactRateLimit(request);

    if (!rateLimit.allowed) {
      response
        .status(429)
        .setHeader('Retry-After', String(rateLimit.retryAfterSeconds))
        .json({ error: 'Too many contact requests. Please try again shortly.' });
      return;
    }

    const payload = buildContactPayload(request);
    const validationError = validateContactPayload(payload);

    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }

    await sendContactEmail(payload);
    response.status(201).json({ ok: true });
  });

  app.get('/api/stats', async (_request, response) => {
    const stats = await getAnalyticsStats();

    response.setHeader('Cache-Control', 'no-store');
    response.json(stats);
  });

  app.use((error, _request, response, _next) => {
    response.status(500).json({
      error: error.message || 'Unexpected backend error.',
    });
  });

  return app;
}

export async function startServer(port = Number(process.env.PORT || 5000)) {
  await initializeDatabase();
  const app = createServerApp();

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      resolve(server);
    });
  });
}

try {
  await startServer();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.stack || error.message : String(error)}\n`);
  process.exit(1);
}
