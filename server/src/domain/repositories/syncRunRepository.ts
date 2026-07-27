import type { SyncRun, SyncRunStatus, SyncStats } from '../entities/index.js'


export type SyncRunOutcome = {
  status: SyncRunStatus
  finishedAt: Date
  stats: SyncStats
  error: string | null
}

export type SyncRunRepository = {
  create(connectionId: string, startedAt: Date): Promise<SyncRun>
  findRunning(connectionId: string): Promise<SyncRun | null>
  findLatest(connectionId: string): Promise<SyncRun | null>
  finish(id: string, outcome: SyncRunOutcome): Promise<void>
  failStaleRunning(before: Date): Promise<number>
}
