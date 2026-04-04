import fs from 'node:fs/promises';
import path from 'node:path';
import initSqlJs from 'sql.js';

const dbFilePath = process.env.ANALYTICS_DB_PATH
  ? path.resolve(process.cwd(), process.env.ANALYTICS_DB_PATH)
  : path.resolve(process.cwd(), 'server', 'data', 'analytics.sqlite');

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

function run(query, params = []) {
  database.run(query, params);
  return queuePersist();
}

function all(query, params = []) {
  return mapRows(database.exec(query, params));
}

function first(query, params = []) {
  return all(query, params)[0] || null;
}

export async function initializeDatabase() {
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

  database.run(
    'CREATE INDEX IF NOT EXISTS idx_events_created_at ON events (created_at DESC);',
  );
  database.run('CREATE INDEX IF NOT EXISTS idx_events_page ON events (page);');
  database.run('CREATE INDEX IF NOT EXISTS idx_events_project_id ON events (project_id);');
  database.run('CREATE INDEX IF NOT EXISTS idx_events_event_type ON events (event_type);');

  await queuePersist();
  return database;
}

export async function insertEvent(event) {
  await initializeDatabase();

  await run(
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

export async function getAnalyticsStats() {
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
      SELECT event_type AS eventType, page, title, project_id AS projectId, target, label, created_at AS createdAt
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
