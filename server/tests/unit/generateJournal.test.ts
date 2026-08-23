import { describe, expect, it } from 'vitest'

import { ValidationError, makeGenerateJournal } from '../../src/domain/index.js'

import { createFakeArtifactRepository } from '../fakes/fakes.js'

import type { ActivityRepository, ActivityWithProject } from '../../src/domain/index.js'


const TIMEZONE = 'America/Sao_Paulo'

const commit = (index: number): ActivityWithProject => ({
  id: `commit-${index}`,
  connectionId: 'conn-1',
  projectId: 'project-1',
  provider: 'github',
  type: 'commit',
  externalId: `commit-${index}`,
  title: `commit ${index}`,
  summary: null,
  url: null,
  actor: { externalId: '42', login: 'octocat', isConnectedUser: true, isBot: false },
  occurredAt: new Date('2026-07-10T14:00:00Z'),
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
  projectName: 'hello-world',
  projectFullName: 'octocat/hello-world',
})

const setup = (available: number) => {
  const artifacts = createFakeArtifactRepository()
  let served = 0
  const activityRepository: ActivityRepository = {
    async upsertMany() {
      return 0
    },
    async listByUserAndRange(filters) {
      const page = Math.max(0, Math.min(filters.limit, available - served))
      served += page
      return Array.from({ length: page }, (_, index) => commit(served + index))
    },
  }

  return {
    artifacts,
    generateJournal: makeGenerateJournal({
      activityRepository,
      artifactRepository: artifacts.repository,
    }),
  }
}

const request = {
  userId: 'user-1',
  period: 'custom' as const,
  timezone: TIMEZONE,
  from: '2026-07-10',
  to: '2026-07-10',
  providers: ['github' as const],
}

describe('makeGenerateJournal', () => {
  it('stores the journal it built for the reader', async () => {
    const { artifacts, generateJournal } = setup(3)

    const artifact = await generateJournal(request)

    expect(artifacts.artifacts).toHaveLength(1)
    expect(artifact).toMatchObject({ userId: 'user-1', kind: 'journal', period: 'custom' })
    expect(artifact.payload.activityCount).toBe(3)
  })

  it('opens a lineage of its own', async () => {
    const { generateJournal } = setup(1)

    const artifact = await generateJournal(request)

    expect(artifact.rootId).toBe(artifact.id)
  })

  it('refuses to read a period with no source behind it', async () => {
    const { generateJournal } = setup(1)

    await expect(generateJournal({ ...request, providers: [] })).rejects.toBeInstanceOf(
      ValidationError,
    )
  })

  it('leaves the period rules to resolvePeriod', async () => {
    const { generateJournal } = setup(1)

    await expect(generateJournal({ ...request, period: 'year' })).rejects.toBeInstanceOf(
      ValidationError,
    )
    await expect(
      generateJournal({ ...request, from: '2026-01-01', to: '2026-06-01' }),
    ).rejects.toBeInstanceOf(ValidationError)
  })

  it('says so when the period held more activity than it could read', async () => {
    const { generateJournal } = setup(20_500)

    const artifact = await generateJournal(request)

    expect(artifact.payload.truncated).toBe(true)
  })
})
