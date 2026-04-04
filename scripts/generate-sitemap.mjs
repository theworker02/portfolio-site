import fs from 'node:fs/promises';
import path from 'node:path';

const siteUrl = (process.env.VITE_SITE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
const now = new Date().toISOString();
const projectIds = [
  'magnificent-language',
  'find-the-bug',
  'abandonment-scanner',
  'spotiq',
  'mini-wiki',
  'firecomm-os',
  'steel-lang',
  'rapidlink',
  'harvesthub',
  'social-app',
  'project-launch-kit',
];

const staticRoutes = ['/', '/projects', '/docs', '/about', '/skills', '/github', '/dashboard', '/contact'];
const dynamicRoutes = projectIds.flatMap((projectId) => [`/projects/${projectId}`, `/demo/${projectId}`]);
const routes = [...staticRoutes, ...dynamicRoutes];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${now}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

await fs.mkdir(path.resolve(process.cwd(), 'public'), { recursive: true });
await fs.writeFile(path.resolve(process.cwd(), 'public', 'sitemap.xml'), sitemap);
await fs.writeFile(path.resolve(process.cwd(), 'public', 'robots.txt'), robots);
