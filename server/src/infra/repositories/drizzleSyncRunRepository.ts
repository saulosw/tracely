import { and, desc, eq, lt } from 'drizzle-orm'

import { emptySyncStats } from '../../domain/index.js'
import { syncRuns } from '../database/schema/index.js'
import { requireRow } from './rows.js'

import type { SyncRunRepository } from '../../domain/index.js'
import type { Database } from '../database/index.js'


export const createDrizzleSyncRunRepository = (db: Database): SyncRunRepository => ({
  async create(connectionId, startedAt) {
    const [row] = await db
      .insert(syncRuns)
      .values({ connectionId, status: 'running', startedAt, stats: emptySyncStats() })
      .returning()
    return requireRow(row)
  },

  async findRunning(connectionId) {
    const [row] = await db
      .select()
      .from(syncRuns)
      .where(and(eq(syncRuns.connectionId, connectionId), eq(syncRuns.status, 'running')))
      .orderBy(desc(syncRuns.startedAt))
      .limit(1)
    return row ?? null
  },

  async findLatest(connectionId) {
    const [row] = await db
      .select()
      .from(syncRuns)
      .where(eq(syncRuns.connectionId, connectionId))
      .orderBy(desc(syncRuns.startedAt))
      .limit(1)
    return row ?? null
  },

  async finish(id, outcome) {
    await db
      .update(syncRuns)
      .set({
        status: outcome.status,
        finishedAt: outcome.finishedAt,
        stats: outcome.stats,
        error: outcome.error,
      })
      .where(eq(syncRuns.id, id))
  },

  async failStaleRunning(before) {
    const rows = await db
      .update(syncRuns)
      .set({
        status: 'failed',
        finishedAt: new Date(),
        error: 'Interrupted by a server restart',
      })
      .where(and(eq(syncRuns.status, 'running'), lt(syncRuns.startedAt, before)))
      .returning({ id: syncRuns.id })
    return rows.length
  },
})
