import { existsSync } from 'node:fs'

import { z } from 'zod'


const LOG_LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as const

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.url(),
  CLIENT_URL: z.url(),
  TOKEN_ENCRYPTION_KEY: z
    .base64()
    .refine(
      (value) => Buffer.from(value, 'base64').byteLength === 32,
      'must decode to exactly 32 bytes',
    ),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  GITHUB_OAUTH_CALLBACK_URL: z.url(),
  GITHUB_OAUTH_SCOPES: z.string().default('read:user user:email read:org repo'),
  LOG_LEVEL: z.enum(LOG_LEVELS).default('debug'),
})

export type Config = {
  nodeEnv: 'development' | 'test' | 'production'
  port: number
  databaseUrl: string
  clientUrl: string
  tokenEncryptionKey: Buffer
  logLevel: (typeof LOG_LEVELS)[number]
  github: {
    clientId: string
    clientSecret: string
    callbackUrl: string
    scopes: string[]
  }
}

export const loadConfig = (): Config => {
  if (existsSync('.env')) {
    process.loadEnvFile()
  }

  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ')
    throw new Error(`Invalid environment configuration — ${issues}`)
  }

  const env = parsed.data

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    databaseUrl: env.DATABASE_URL,
    clientUrl: env.CLIENT_URL,
    tokenEncryptionKey: Buffer.from(env.TOKEN_ENCRYPTION_KEY, 'base64'),
    logLevel: env.LOG_LEVEL,
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackUrl: env.GITHUB_OAUTH_CALLBACK_URL,
      scopes: env.GITHUB_OAUTH_SCOPES.split(' ').filter(Boolean),
    },
  }
}
