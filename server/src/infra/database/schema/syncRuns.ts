import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { connections } from './connections.js'

import type { SyncRunStatus, SyncStats } from '../../../domain/index.js'


export const syncRuns = pgTable(
  'sync_runs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    connectionId: uuid('connection_id')
      .notNull()
      .references(() => connections.id, { onDelete: 'cascade' }),
    status: text('status').$type<SyncRunStatus>().notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
    stats: jsonb('stats').$type<SyncStats>().notNull(),
    error: text('error'),
  },
  (table) => [index('sync_runs_connection_started_idx').on(table.connectionId, table.startedAt.desc())],
)
