import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().min(1, 'DIRECT_URL is required'),

  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  SUPABASE_STORAGE_BUCKET: z.string().default('product-images'),

  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRATION: z.string().default('24h'),

  WHATSAPP_NUMBER: z.string().min(1, 'WHATSAPP_NUMBER is required'),

  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  MAX_FILE_SIZE_MB: z.coerce.number().default(5),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const missingVars = Object.entries(errors)
      .map(([key, messages]) => `  ${key}: ${(messages ?? []).join(', ')}`)
      .join('\n');

    // eslint-disable-next-line no-console
    console.error(`\n❌ Environment validation failed:\n${missingVars}\n`);
    // eslint-disable-next-line no-console
    console.error('Please check your .env file against .env.example\n');
    process.exit(1);
  }

  return parsed.data;
}

export const config = validateEnv();

export type Config = typeof config;
