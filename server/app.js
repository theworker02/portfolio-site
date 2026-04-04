import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'node:url';
import { getAnalyticsStats, initializeDatabase, insertEvent } from './database.js';

const currentFilePath = fileURLToPath(import.meta.url);
const configuredOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];
const contactInbox = process.env.CONTACT_TO_EMAIL || process.env.EMAIL_USER || 'matthewlooney5@gmail.com';
const contactRateWindowMs = 15 * 60 * 1000;
const contactRateLimit = 5;
const contactRequests = new Map();

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

export function createAnalyticsApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || configuredOrigins.length === 0 || configuredOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error('Origin not allowed by analytics backend.'));
      },
    }),
  );
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', async (_request, response) => {
    await initializeDatabase();
    response.json({
      ok: true,
      service: 'portfolio-analytics',
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
      error: error.message || 'Unexpected analytics backend error.',
    });
  });

  return app;
}

export async function startAnalyticsServer(port = Number(process.env.ANALYTICS_PORT || 8787)) {
  await initializeDatabase();
  const app = createAnalyticsApp();

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      process.stdout.write(`Portfolio backend listening on http://127.0.0.1:${port}\n`);
      resolve(server);
    });
  });
}

if (process.argv[1] === currentFilePath) {
  startAnalyticsServer();
}
