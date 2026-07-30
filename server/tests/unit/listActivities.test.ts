import { describe, expect, it } from 'vitest'

import { ValidationError, makeListActivities } from '../../src/domain/index.js'

import type {
  ActivityListFilters,
  ActivityRepository,
  ActivityWithProject,
} from '../../src/domain/index.js'


const item = (index: number): ActivityWithProject => ({
  id: `id-${index}`,
  connectionId: 'conn-1',
  projectId: null,
  provider: 'github',
  type: 'commit',
  externalId: `sha-${index}`,
  title: `commit ${index}`,
  summary: null,
  url: null,
  actor: { externalId: '42', login: 'octocat', isConnectedUser: true, isBot: false },
  occurredAt: new Date(Date.UTC(2026, 6, 20 - index)),
  details: {
    kind: 'commit',
    sha: `sha-${index}`,
    message: `commit ${index}`,
    authorName: null,
    authorEmail: null,
    branch: null,
    additions: null,
    deletions: null,
    filesChanged: null,
    files: null,
    filesTruncated: true,
  },
  recordedAt: new Date(),
  projectName: null,
  projectFullName: null,
})

const setup = (available: number) => {
  const calls: ActivityListFilters[] = []
  const repository: ActivityRepository = {
    async upsertMany() {
      return 0
    },
    async listByUserAndRange(filters) {
      calls.push(filters)
      return Array.from({ length: Math.min(filters.limit, available) }, (_, i) => item(i))
    },
  }
  return { calls, listActivities: makeListActivities({ activityRepository: repository }) }
}

const range = {
  userId: 'user-1',
  from: new Date('2026-07-01T00:00:00Z'),
  to: new Date('2026-07-20T00:00:00Z'),
}

describe('listActivities', () => {
  it('rejects an inverted time range', async () => {
    const { listActivities } = setup(0)
    await expect(
      listActivities({ ...range, from: range.to, to: range.from }),
    ).rejects.toBeInstanceOf(ValidationError)
  })

  it('rejects an out-of-bounds page size', async () => {
    const { listActivities } = setup(0)
    await expect(listActivities({ ...range, first: 0 })).rejects.toBeInstanceOf(ValidationError)
    await expect(listActivities({ ...range, first: 101 })).rejects.toBeInstanceOf(ValidationError)
  })

  it('rejects a malformed cursor', async () => {
    const { listActivities } = setup(0)
    await expect(listActivities({ ...range, after: '###' })).rejects.toBeInstanceOf(
      ValidationError,
    )
  })

  it('returns everything without a cursor when the page is not full', async () => {
    const { listActivities } = setup(3)
    const page = await listActivities({ ...range, first: 5 })
    expect(page.items).toHaveLength(3)
    expect(page.nextCursor).toBeNull()
  })

  it('paginates by fetching one extra row and passing the decoded cursor back', async () => {
    const { listActivities, calls } = setup(10)

    const page = await listActivities({ ...range, first: 2 })
    expect(calls[0]?.limit).toBe(3)
    expect(page.items).toHaveLength(2)
    expect(page.nextCursor).not.toBeNull()

    await listActivities({ ...range, first: 2, after: page.nextCursor })
    const lastItem = page.items[page.items.length - 1]!
    expect(calls[1]?.cursor).toEqual({ occurredAt: lastItem.occurredAt, id: lastItem.id })
  })
})
