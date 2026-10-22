import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { connectDB } from './config/db.js';

const projectEnvPath = fileURLToPath(new URL('../.env', import.meta.url));
const legacyEnvPath = fileURLToPath(new URL('./.env', import.meta.url));
dotenv.config({ path: existsSync(projectEnvPath) ? projectEnvPath : legacyEnvPath });

const port = Number(process.env.PORT || 3000);
try {
  await connectDB();
  const { default: app } = await import('./app.js');
  const server = app.listen(port, () => console.log(`API listening on port ${port}`));
  const shutdown = (signal) => {
    console.log(`${signal} received; shutting down`);
    server.close(async () => { const mongoose = await import('mongoose'); await mongoose.default.disconnect(); process.exit(0); });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
} catch (error) {
  console.error('Failed to start API:', error.message);
  process.exit(1);
}
