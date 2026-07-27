import { existsSync } from 'node:fs'

import { defineConfig } from 'drizzle-kit'


if (existsSync('.env')) {
  process.loadEnvFile()
}

export default defineConfig({
  schema: './src/infra/database/schema/index.ts',
  out: './src/infra/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgresql://tracely:tracely_dev@localhost:5432/tracely',
  },
})
