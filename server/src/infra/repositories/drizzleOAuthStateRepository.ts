import { eq } from 'drizzle-orm'

import { oauthStates } from '../database/schema/index.js'

import type { OAuthStateRepository } from '../../domain/index.js'
import type { Database } from '../database/index.js'


export const createDrizzleOAuthStateRepository = (db: Database): OAuthStateRepository => ({
  async create(state) {
    await db.insert(oauthStates).values(state)
  },

  async consume(state) {
    const [row] = await db.delete(oauthStates).where(eq(oauthStates.state, state)).returning()
    if (!row) {
      return null
    }
    return {
      state: row.state,
      userId: row.userId,
      provider: row.provider,
      expiresAt: row.expiresAt,
    }
  },
})
