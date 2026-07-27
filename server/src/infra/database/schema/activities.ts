import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { connections } from './connections.js'
import { projects } from './projects.js'

import type { ActivityDetails, ActivityType, Provider } from '../../../domain/index.js'


export const activities = pgTable(
  'activities',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    connectionId: uuid('connection_id')
      .notNull()
      .references(() => connections.id, { onDelete: 'cascade' }),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
    provider: text('provider').$type<Provider>().notNull(),
    type: text('type').$type<ActivityType>().notNull(),
    externalId: text('external_id').notNull(),
    title: text('title').notNull(),
    summary: text('summary'),
    url: text('url'),
    actorExternalId: text('actor_external_id'),
    actorLogin: text('actor_login'),
    actorIsConnectedUser: boolean('actor_is_connected_user').notNull(),
    actorIsBot: boolean('actor_is_bot').notNull(),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
    details: jsonb('details').$type<ActivityDetails>().notNull(),
    recordedAt: timestamp('recorded_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('activities_connection_type_external_uq').on(
      table.connectionId,
      table.type,
      table.externalId,
    ),
    index('activities_connection_occurred_idx').on(
      table.connectionId,
      table.occurredAt.desc(),
    ),
    index('activities_project_idx').on(table.projectId),
  ],
)
