import { fileURLToPath } from 'node:url';
import { startAnalyticsServer } from '../server/app.js';

const currentFilePath = fileURLToPath(import.meta.url);

export { createAnalyticsApp, startAnalyticsServer } from '../server/app.js';

if (process.argv[1] === currentFilePath) {
  startAnalyticsServer();
}
