import { ValidationError } from '../../errors/index.js'

import type { ActivityType, ActivityWithProject, Provider } from '../../entities/index.js'
import type { ActivityRepository } from '../../repositories/index.js'


const DEFAULT_PAGE_SIZE = 50
const MAX_PAGE_SIZE = 100

export type ListActivitiesInput = {
  userId: string
  from: Date
  to: Date
  providers?: Provider[]
  types?: ActivityType[]
  projectIds?: string[]
  first?: number
  after?: string | null
}

export type ActivityPage = {
  items: ActivityWithProject[]
  nextCursor: string | null
}

export type ListActivities = (input: ListActivitiesInput) => Promise<ActivityPage>

const encodeCursor = (occurredAt: Date, id: string): string =>
  Buffer.from(`${occurredAt.toISOString()}|${id}`).toString('base64url')

const decodeCursor = (cursor: string): { occurredAt: Date; id: string } => {
  const decoded = Buffer.from(cursor, 'base64url').toString('utf8')
  const separator = decoded.indexOf('|')
  const occurredAt = new Date(decoded.slice(0, separator))
  const id = decoded.slice(separator + 1)
  if (separator === -1 || Number.isNaN(occurredAt.getTime()) || !id) {
    throw new ValidationError('Invalid pagination cursor', { after: 'Cursor is malformed' })
  }
  return { occurredAt, id }
}

export const makeListActivities = (deps: {
  activityRepository: ActivityRepository
}): ListActivities => {
  return async (input) => {
    if (input.from.getTime() >= input.to.getTime()) {
      throw new ValidationError('Invalid time range', { from: 'Must be before "to"' })
    }
    const first = input.first ?? DEFAULT_PAGE_SIZE
    if (first < 1 || first > MAX_PAGE_SIZE) {
      throw new ValidationError('Invalid page size', {
        first: `Must be between 1 and ${MAX_PAGE_SIZE}`,
      })
    }

    const items = await deps.activityRepository.listByUserAndRange({
      userId: input.userId,
      from: input.from,
      to: input.to,
      ...(input.providers?.length ? { providers: input.providers } : {}),
      ...(input.types?.length ? { types: input.types } : {}),
      ...(input.projectIds?.length ? { projectIds: input.projectIds } : {}),
      limit: first + 1,
      ...(input.after ? { cursor: decodeCursor(input.after) } : {}),
    })

    const hasNextPage = items.length > first
    const page = hasNextPage ? items.slice(0, first) : items
    const last = page[page.length - 1]

    return {
      items: page,
      nextCursor: hasNextPage && last ? encodeCursor(last.occurredAt, last.id) : null,
    }
  }
}
