import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { users } from './users.js'

import type { Provider } from '../../../domain/index.js'


export const oauthStates = pgTable('oauth_states', {
  state: text('state').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').$type<Provider>().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
