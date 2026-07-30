import { describe, expect, it } from 'vitest'

import {
  AuthorizationError,
  ProviderAuthError,
  ProviderError,
  createProviderRegistry,
  makeSyncConnection,
} from '../../src/domain/index.js'
import {
  createFakeActivityProvider,
  createFakeActivityRepository,
  createFakeConnectionRepository,
  createFakeProjectRepository,
  createFakeSyncRunRepository,
  fakeTokenCipher,
  sourceCommit,
  sourceProject,
} from '../fakes/fakes.js'

import type { ActivityProvider, Connection } from '../../src/domain/index.js'
import type { FakeProviderPlan } from '../fakes/fakes.js'


const connection: Connection = {
  id: 'conn-1',
  userId: 'user-1',
  provider: 'github',
  externalAccountId: '42',
  accountLogin: 'octocat',
  accountName: 'Alex',
  avatarUrl: null,
  encryptedAccessToken: 'enc:gh-token',
  scopes: ['repo'],
  status: 'active',
  syncCursor: {},
  lastSyncedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const setup = (plan: FakeProviderPlan, provider?: ActivityProvider) => {
  const connections = createFakeConnectionRepository([{ ...connection }])
  const projects = createFakeProjectRepository()
  const activities = createFakeActivityRepository()
  const syncRuns = createFakeSyncRunRepository()
  const syncConnection = makeSyncConnection({
    connectionRepository: connections.repository,
    projectRepository: projects.repository,
    activityRepository: activities.repository,
    syncRunRepository: syncRuns.repository,
    activityProviders: createProviderRegistry({
      github: provider ?? createFakeActivityProvider(plan),
    }),
    tokenCipher: fakeTokenCipher,
  })
  return { connections, projects, activities, syncRuns, syncConnection }
}

describe('syncConnection', () => {
  it('syncs projects and activities and finishes the run as succeeded', async () => {
    const project = sourceProject()
    const { syncConnection, syncRuns, projects, activities, connections } = setup({
      projects: [project],
      activitiesByProject: { [project.fullName]: [sourceCommit(), sourceCommit()] },
    })

    const trigger = await syncConnection({ userId: 'user-1', connectionId: 'conn-1' })
    expect(trigger.run.status).toBe('running')
    await trigger.completion

    const run = syncRuns.runs[0]!
    expect(run.status).toBe('succeeded')
    expect(run.stats.projects).toBe(1)
    expect(run.stats.activities.commit).toBe(2)
    expect(activities.activities).toHaveLength(2)
    expect(activities.activities[0]?.connectionId).toBe('conn-1')
    expect(activities.activities[0]?.projectId).toBe(projects.projects[0]?.id)
    expect(projects.projects[0]?.lastSyncedAt).toEqual(run.startedAt)
    expect(connections.connections[0]?.lastSyncedAt).toEqual(run.startedAt)
  })

  it('returns the already-running run instead of starting another', async () => {
    const project = sourceProject()
    const { syncConnection } = setup({
      projects: [project],
      activitiesByProject: { [project.fullName]: [] },
    })

    const first = await syncConnection({ userId: 'user-1', connectionId: 'conn-1' })
    const second = await syncConnection({ userId: 'user-1', connectionId: 'conn-1' })

    expect(second.run.id).toBe(first.run.id)
    expect(second.completion).toBeNull()
    await first.completion
  })

  it('records per-project failures and finishes as partial', async () => {
    const good = sourceProject()
    const bad = sourceProject({ externalId: '1002', name: 'broken', fullName: 'octocat/broken' })
    const { syncConnection, syncRuns, projects } = setup({
      projects: [good, bad],
      activitiesByProject: {
        [good.fullName]: [sourceCommit()],
        [bad.fullName]: new ProviderError('GitHub request failed with status 500'),
      },
    })

    const trigger = await syncConnection({ userId: 'user-1', connectionId: 'conn-1' })
    await trigger.completion

    const run = syncRuns.runs[0]!
    expect(run.status).toBe('partial')
    expect(run.stats.projects).toBe(1)
    expect(run.stats.projectErrors).toEqual([
      { project: 'octocat/broken', message: 'GitHub request failed with status 500' },
    ])
    const failedProject = projects.projects.find((entry) => entry.fullName === 'octocat/broken')
    expect(failedProject?.lastSyncedAt).toBeNull()
  })

  it('marks the connection as errored when provider auth is no longer valid', async () => {
    const failingProvider: ActivityProvider = {
      async fetchAccount() {
        throw new ProviderAuthError()
      },
      async *fetchProjects() {
        yield []
      },
      async *fetchProjectActivities() {
        yield []
      },
    }
    const { syncConnection, syncRuns, connections } = setup(
      { projects: [], activitiesByProject: {} },
      failingProvider,
    )

    const trigger = await syncConnection({ userId: 'user-1', connectionId: 'conn-1' })
    await trigger.completion

    expect(syncRuns.runs[0]?.status).toBe('failed')
    expect(connections.connections[0]?.status).toBe('error')
  })

  it('skips archived projects and projects without new pushes', async () => {
    const archived = sourceProject({ externalId: '2001', fullName: 'octocat/old', isArchived: true })
    const { syncConnection, syncRuns } = setup({
      projects: [archived],
      activitiesByProject: {
        [archived.fullName]: new ProviderError('should never be fetched'),
      },
    })

    const trigger = await syncConnection({ userId: 'user-1', connectionId: 'conn-1' })
    await trigger.completion

    expect(syncRuns.runs[0]?.status).toBe('succeeded')
    expect(syncRuns.runs[0]?.stats.projectErrors).toHaveLength(0)
  })

  it('rejects a connection owned by another user', async () => {
    const { syncConnection } = setup({ projects: [], activitiesByProject: {} })
    await expect(
      syncConnection({ userId: 'user-2', connectionId: 'conn-1' }),
    ).rejects.toBeInstanceOf(AuthorizationError)
  })
})
