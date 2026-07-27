import type { ActivityType } from './activity.js'


export type SyncRunStatus = 'running' | 'succeeded' | 'failed' | 'partial'

export type SyncStats = {
  projects: number
  activities: Partial<Record<ActivityType, number>>
  projectErrors: { project: string; message: string }[]
}

export type SyncRun = {
  id: string
  connectionId: string
  status: SyncRunStatus
  startedAt: Date
  finishedAt: Date | null
  stats: SyncStats
  error: string | null
}

export const emptySyncStats = (): SyncStats => ({
  projects: 0,
  activities: {},
  projectErrors: [],
})
