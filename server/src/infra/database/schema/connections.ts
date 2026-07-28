import { jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

import { users } from './users.js'

import type { ConnectionStatus, Provider, SyncCursor } from '../../../domain/index.js'


export const connections = pgTable(
  'connections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: text('provider').$type<Provider>().notNull(),
    externalAccountId: text('external_account_id').notNull(),
    accountLogin: text('account_login').notNull(),
    accountName: text('account_name'),
    avatarUrl: text('avatar_url'),
    encryptedAccessToken: text('encrypted_access_token').notNull(),
    scopes: text('scopes').array().notNull().default([]),
    status: text('status').$type<ConnectionStatus>().notNull().default('active'),
    syncCursor: jsonb('sync_cursor').$type<SyncCursor>().notNull().default({}),
    lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('connections_user_provider_account_uq').on(
      table.userId,
      table.provider,
      table.externalAccountId,
    ),
  ],
)
