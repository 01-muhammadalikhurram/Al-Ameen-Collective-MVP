import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from './index';
import { logger } from './logger';

// Standard singleton pattern for Prisma Client with pg adapter
// This prevents exhausting connection limits during hot reloading and development
const connectionString = config.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  logger.error(err, 'Unexpected error on idle pg client');
  process.exit(-1);
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
  ],
});

prisma.$on('query', (e) => {
  if (config.NODE_ENV !== 'production') {
    logger.debug({ query: e.query, duration: `${e.duration}ms` }, 'Prisma Query');
  }
});
