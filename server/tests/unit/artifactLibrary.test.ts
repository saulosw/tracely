import { describe, expect, it } from 'vitest'

import {
  NotFoundError,
  ValidationError,
  makeGetArtifact,
  makeListArtifactVersions,
  makeListArtifacts,
  makeRegenerateArtifact,
} from '../../src/domain/index.js'

import { createFakeArtifactRepository } from '../fakes/fakes.js'

import type { GenerateJournal, NewArtifact } from '../../src/domain/index.js'


const emptyPayload = {
  kind: 'journal' as const,
  granularity: 'day' as const,
  activityCount: 0,
  truncated: false,
  sections: [],
}

const newArtifact = (overrides: Partial<NewArtifact> = {}): NewArtifact => ({
  userId: 'user-1',
  rootId: null,
  kind: 'journal',
  period: 'week',
  from: new Date('2026-07-06T03:00:00Z'),
  to: new Date('2026-07-12T02:59:59.999Z'),
  timezone: 'America/Sao_Paulo',
  providers: ['github'],
  payload: emptyPayload,
  ...overrides,
})

const setup = () => {
  const artifacts = createFakeArtifactRepository()
  const getArtifact = makeGetArtifact({ artifactRepository: artifacts.repository })
  return {
    artifacts,
    getArtifact,
    listArtifacts: makeListArtifacts({ artifactRepository: artifacts.repository }),
    listArtifactVersions: makeListArtifactVersions({
      artifactRepository: artifacts.repository,
      getArtifact,
    }),
  }
}

describe('makeGetArtifact', () => {
  it('hands the reader their own artifact', async () => {
    const { artifacts, getArtifact } = setup()
    const stored = await artifacts.repository.create(newArtifact())

    await expect(getArtifact({ userId: 'user-1', artifactId: stored.id })).resolves.toMatchObject({
      id: stored.id,
    })
  })

  it('reports someone else artifact as missing rather than forbidden', async () => {
    const { artifacts, getArtifact } = setup()
    const stored = await artifacts.repository.create(newArtifact({ userId: 'user-2' }))

    await expect(getArtifact({ userId: 'user-1', artifactId: stored.id })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })

  it('reports an id that is not an id as missing', async () => {
    const { getArtifact } = setup()

    await expect(getArtifact({ userId: 'user-1', artifactId: 'nope' })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })
})

describe('makeListArtifacts', () => {
  it('shows one entry per lineage, the newest of each', async () => {
    const { artifacts, listArtifacts } = setup()
    const first = await artifacts.repository.create(newArtifact())
    const regenerated = await artifacts.repository.create(newArtifact({ rootId: first.rootId }))
    await artifacts.repository.create(newArtifact({ period: 'month' }))

    const page = await listArtifacts({ userId: 'user-1' })

    expect(page.items).toHaveLength(2)
    expect(page.items.map((artifact) => artifact.id)).toContain(regenerated.id)
    expect(page.items.map((artifact) => artifact.id)).not.toContain(first.id)
  })

  it('pages with a cursor and stops when there is nothing left', async () => {
    const { artifacts, listArtifacts } = setup()
    await artifacts.repository.create(newArtifact())
    await artifacts.repository.create(newArtifact({ period: 'month' }))

    const first = await listArtifacts({ userId: 'user-1', first: 1 })
    expect(first.nextCursor).not.toBeNull()

    const second = await listArtifacts({ userId: 'user-1', first: 1, after: first.nextCursor })
    expect(second.items).toHaveLength(1)
    expect(second.nextCursor).toBeNull()
    expect(second.items[0]?.id).not.toBe(first.items[0]?.id)
  })

  it('refuses a page size it will not serve', async () => {
    const { listArtifacts } = setup()

    await expect(listArtifacts({ userId: 'user-1', first: 500 })).rejects.toBeInstanceOf(
      ValidationError,
    )
  })
})

describe('makeListArtifactVersions', () => {
  it('lists the whole lineage newest first, from any of its versions', async () => {
    const { artifacts, listArtifactVersions } = setup()
    const first = await artifacts.repository.create(newArtifact())
    const second = await artifacts.repository.create(newArtifact({ rootId: first.rootId }))

    const versions = await listArtifactVersions({ userId: 'user-1', artifactId: first.id })

    expect(versions.map((version) => version.id)).toEqual([second.id, first.id])
  })
})

describe('makeRegenerateArtifact', () => {
  const regenerateWith = (artifacts: ReturnType<typeof createFakeArtifactRepository>) => {
    const calls: Parameters<GenerateJournal>[0][] = []
    const generateJournal: GenerateJournal = async (input) => {
      calls.push(input)
      return artifacts.repository.create(
        newArtifact({ rootId: input.rootId ?? null, period: input.period }),
      )
    }
    return {
      calls,
      regenerateArtifact: makeRegenerateArtifact({
        getArtifact: makeGetArtifact({ artifactRepository: artifacts.repository }),
        generateJournal,
      }),
    }
  }

  it('writes a sibling into the lineage instead of a new one', async () => {
    const { artifacts } = setup()
    const stored = await artifacts.repository.create(newArtifact())
    const { regenerateArtifact } = regenerateWith(artifacts)

    const next = await regenerateArtifact({ userId: 'user-1', artifactId: stored.id })

    expect(next.id).not.toBe(stored.id)
    expect(next.rootId).toBe(stored.rootId)
  })

  it('reuses the choices the reader made the first time', async () => {
    const { artifacts } = setup()
    const stored = await artifacts.repository.create(newArtifact({ period: 'custom' }))
    const { calls, regenerateArtifact } = regenerateWith(artifacts)

    await regenerateArtifact({ userId: 'user-1', artifactId: stored.id })

    expect(calls[0]).toMatchObject({
      period: 'custom',
      timezone: 'America/Sao_Paulo',
      providers: ['github'],
      from: '2026-07-06',
      to: '2026-07-11',
    })
  })

  it('refuses to regenerate an artifact that is not the reader own', async () => {
    const { artifacts } = setup()
    const stored = await artifacts.repository.create(newArtifact({ userId: 'user-2' }))
    const { regenerateArtifact } = regenerateWith(artifacts)

    await expect(
      regenerateArtifact({ userId: 'user-1', artifactId: stored.id }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})
