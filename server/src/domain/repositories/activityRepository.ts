import type {
  ActivityType,
  ActivityWithProject,
  NewActivity,
  Provider,
} from '../entities/index.js'


export type ActivityListFilters = {
  userId: string
  from: Date
  to: Date
  providers?: Provider[]
  types?: ActivityType[]
  projectIds?: string[]
  limit: number
  cursor?: { occurredAt: Date; id: string }
}

export type ActivityRepository = {
  upsertMany(activities: NewActivity[]): Promise<number>
  listByUserAndRange(filters: ActivityListFilters): Promise<ActivityWithProject[]>
}
