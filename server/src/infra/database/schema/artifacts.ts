import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { users } from './users.js'

import type {
  ArtifactKind,
  ArtifactPayload,
  ArtifactPeriod,
  Provider,
} from '../../../domain/index.js'


export const artifacts = pgTable(
  'artifacts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    rootId: uuid('root_id').notNull(),
    kind: text('kind').$type<ArtifactKind>().notNull(),
    period: text('period').$type<ArtifactPeriod>().notNull(),
    rangeFrom: timestamp('range_from', { withTimezone: true }).notNull(),
    rangeTo: timestamp('range_to', { withTimezone: true }).notNull(),
    timezone: text('timezone').notNull(),
    providers: text('providers').array().$type<Provider[]>().notNull(),
    payload: jsonb('payload').$type<ArtifactPayload>().notNull(),
    generatedAt: timestamp('generated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('artifacts_user_generated_idx').on(table.userId, table.generatedAt.desc()),
    index('artifacts_root_generated_idx').on(table.rootId, table.generatedAt.desc()),
  ],
)
