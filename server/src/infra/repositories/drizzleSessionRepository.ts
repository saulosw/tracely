import { and, eq, gt } from 'drizzle-orm'

import { sessions } from '../database/schema/index.js'
import { requireRow } from './rows.js'

import type { SessionRepository } from '../../domain/index.js'
import type { Database } from '../database/index.js'


export const createDrizzleSessionRepository = (db: Database): SessionRepository => ({
  async create(session) {
    const [row] = await db.insert(sessions).values(session).returning()
    return requireRow(row)
  },

  async findActiveByTokenHash(tokenHash, now) {
    const [row] = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, now)))
      .limit(1)
    return row ?? null
  },

  async deleteByTokenHash(tokenHash) {
    await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash))
  },
})
