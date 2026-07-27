import { eq } from 'drizzle-orm'

import { connections } from '../database/schema/index.js'
import { requireRow } from './rows.js'

import type { ConnectionRepository } from '../../domain/index.js'
import type { Database } from '../database/index.js'


export const createDrizzleConnectionRepository = (db: Database): ConnectionRepository => ({
  async upsert(connection) {
    const [row] = await db
      .insert(connections)
      .values(connection)
      .onConflictDoUpdate({
        target: [connections.userId, connections.provider, connections.externalAccountId],
        set: {
          accountLogin: connection.accountLogin,
          accountName: connection.accountName,
          avatarUrl: connection.avatarUrl,
          encryptedAccessToken: connection.encryptedAccessToken,
          scopes: connection.scopes,
          status: connection.status,
          updatedAt: new Date(),
        },
      })
      .returning()
    return requireRow(row)
  },

  async findById(id) {
    const [row] = await db.select().from(connections).where(eq(connections.id, id)).limit(1)
    return row ?? null
  },

  async listByUser(userId) {
    return db.select().from(connections).where(eq(connections.userId, userId))
  },

  async updateStatus(id, status) {
    await db
      .update(connections)
      .set({ status, updatedAt: new Date() })
      .where(eq(connections.id, id))
  },

  async updateAfterSync(id, syncCursor, lastSyncedAt) {
    await db
      .update(connections)
      .set({ syncCursor, lastSyncedAt, updatedAt: new Date() })
      .where(eq(connections.id, id))
  },

  async delete(id) {
    await db.delete(connections).where(eq(connections.id, id))
  },
})
