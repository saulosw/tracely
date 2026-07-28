import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { connections } from './connections.js'

import type { ProjectVisibility, Provider } from '../../../domain/index.js'


export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    connectionId: uuid('connection_id')
      .notNull()
      .references(() => connections.id, { onDelete: 'cascade' }),
    provider: text('provider').$type<Provider>().notNull(),
    externalId: text('external_id').notNull(),
    name: text('name').notNull(),
    fullName: text('full_name').notNull(),
    ownerLogin: text('owner_login').notNull(),
    description: text('description'),
    visibility: text('visibility').$type<ProjectVisibility>().notNull(),
    isFork: boolean('is_fork').notNull(),
    isArchived: boolean('is_archived').notNull(),
    defaultBranch: text('default_branch'),
    primaryLanguage: text('primary_language'),
    providerCreatedAt: timestamp('provider_created_at', { withTimezone: true }),
    providerPushedAt: timestamp('provider_pushed_at', { withTimezone: true }),
    lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('projects_connection_external_uq').on(table.connectionId, table.externalId),
  ],
)
