import { randomUUID } from 'node:crypto'

import { emptySyncStats } from '../../src/domain/index.js'

import type {
  Activity,
  ActivityProvider,
  Connection,
  NewConnection,
  OAuthState,
  PasswordHasher,
  Project,
  ProviderAccount,
  ProviderOAuthClient,
  Session,
  SourceActivity,
  SourceProject,
  SyncRun,
  TokenCipher,
  TokenGenerator,
  User,
} from '../../src/domain/index.js'
import type {
  ActivityRepository,
  ConnectionRepository,
  OAuthStateRepository,
  ProjectRepository,
  SessionRepository,
  SyncRunRepository,
  UserRepository,
} from '../../src/domain/index.js'


export const createFakeUserRepository = () => {
  const users: User[] = []
  const repository: UserRepository = {
    async findByEmail(email) {
      return users.find((user) => user.email === email) ?? null
    },
    async findById(id) {
      return users.find((user) => user.id === id) ?? null
    },
    async create(user) {
      const created: User = {
        ...user,
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      users.push(created)
      return created
    },
  }
  return { repository, users }
}

export const createFakeSessionRepository = () => {
  const sessions: Session[] = []
  const repository: SessionRepository = {
    async create(session) {
      const created: Session = { ...session, id: randomUUID(), createdAt: new Date() }
      sessions.push(created)
      return created
    },
    async findActiveByTokenHash(tokenHash, now) {
      return (
        sessions.find(
          (session) => session.tokenHash === tokenHash && session.expiresAt > now,
        ) ?? null
      )
    },
    async deleteByTokenHash(tokenHash) {
      const index = sessions.findIndex((session) => session.tokenHash === tokenHash)
      if (index >= 0) {
        sessions.splice(index, 1)
      }
    },
  }
  return { repository, sessions }
}

export const createFakeOAuthStateRepository = () => {
  const states: OAuthState[] = []
  const repository: OAuthStateRepository = {
    async create(state) {
      states.push(state)
    },
    async consume(state) {
      const index = states.findIndex((entry) => entry.state === state)
      if (index < 0) {
        return null
      }
      const [entry] = states.splice(index, 1)
      return entry ?? null
    },
  }
  return { repository, states }
}

export const createFakeConnectionRepository = (seed: Connection[] = []) => {
  const connections: Connection[] = [...seed]
  const repository: ConnectionRepository = {
    async upsert(connection: NewConnection) {
      const existing = connections.find(
        (entry) =>
          entry.userId === connection.userId &&
          entry.provider === connection.provider &&
          entry.externalAccountId === connection.externalAccountId,
      )
      if (existing) {
        Object.assign(existing, {
          accountLogin: connection.accountLogin,
          accountName: connection.accountName,
          avatarUrl: connection.avatarUrl,
          encryptedAccessToken: connection.encryptedAccessToken,
          scopes: connection.scopes,
          status: connection.status,
          updatedAt: new Date(),
        })
        return existing
      }
      const created: Connection = {
        ...connection,
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      connections.push(created)
      return created
    },
    async findById(id) {
      return connections.find((entry) => entry.id === id) ?? null
    },
    async listByUser(userId) {
      return connections.filter((entry) => entry.userId === userId)
    },
    async updateStatus(id, status) {
      const entry = connections.find((connection) => connection.id === id)
      if (entry) {
        entry.status = status
      }
    },
    async updateAfterSync(id, syncCursor, lastSyncedAt) {
      const entry = connections.find((connection) => connection.id === id)
      if (entry) {
        entry.syncCursor = syncCursor
        entry.lastSyncedAt = lastSyncedAt
      }
    },
    async delete(id) {
      const index = connections.findIndex((entry) => entry.id === id)
      if (index >= 0) {
        connections.splice(index, 1)
      }
    },
  }
  return { repository, connections }
}

export const createFakeProjectRepository = () => {
  const projects: Project[] = []
  const repository: ProjectRepository = {
    async upsertMany(items) {
      return items.map((item) => {
        const existing = projects.find(
          (project) =>
            project.connectionId === item.connectionId &&
            project.externalId === item.externalId,
        )
        if (existing) {
          Object.assign(existing, { ...item, updatedAt: new Date() })
          return existing
        }
        const created: Project = {
          ...item,
          id: randomUUID(),
          lastSyncedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        projects.push(created)
        return created
      })
    },
    async listByConnection(connectionId) {
      return projects.filter((project) => project.connectionId === connectionId)
    },
    async markSynced(id, lastSyncedAt) {
      const project = projects.find((entry) => entry.id === id)
      if (project) {
        project.lastSyncedAt = lastSyncedAt
      }
    },
  }
  return { repository, projects }
}

export const createFakeActivityRepository = () => {
  const activities: Activity[] = []
  const repository: ActivityRepository = {
    async upsertMany(items) {
      for (const item of items) {
        const existing = activities.find(
          (activity) =>
            activity.connectionId === item.connectionId &&
            activity.type === item.type &&
            activity.externalId === item.externalId,
        )
        if (existing) {
          Object.assign(existing, item)
        } else {
          activities.push({ ...item, id: randomUUID(), recordedAt: new Date() })
        }
      }
      return items.length
    },
    async listByUserAndRange() {
      return activities.map((activity) => ({
        ...activity,
        projectName: null,
        projectFullName: null,
      }))
    },
  }
  return { repository, activities }
}

export const createFakeSyncRunRepository = () => {
  const runs: SyncRun[] = []
  const repository: SyncRunRepository = {
    async create(connectionId, startedAt) {
      const run: SyncRun = {
        id: randomUUID(),
        connectionId,
        status: 'running',
        startedAt,
        finishedAt: null,
        stats: emptySyncStats(),
        error: null,
      }
      runs.push(run)
      return run
    },
    async findRunning(connectionId) {
      return (
        runs.find((run) => run.connectionId === connectionId && run.status === 'running') ??
        null
      )
    },
    async findLatest(connectionId) {
      return runs.filter((run) => run.connectionId === connectionId).at(-1) ?? null
    },
    async finish(id, outcome) {
      const run = runs.find((entry) => entry.id === id)
      if (run) {
        run.status = outcome.status
        run.finishedAt = outcome.finishedAt
        run.stats = outcome.stats
        run.error = outcome.error
      }
    },
    async failStaleRunning() {
      return 0
    },
  }
  return { repository, runs }
}

export const fakePasswordHasher: PasswordHasher = {
  async hash(plain) {
    return `hashed:${plain}`
  },
  async verify(plain, hashed) {
    return hashed === `hashed:${plain}`
  },
}

export const createFakeTokenGenerator = (): TokenGenerator => {
  let counter = 0
  return {
    generate: () => {
      counter += 1
      return `token-${counter}`
    },
    hash: (token) => `hash(${token})`,
  }
}

export const fakeTokenCipher: TokenCipher = {
  encrypt: (plain) => `enc:${plain}`,
  decrypt: (encrypted) => encrypted.slice(4),
}

export const fakeAccount: ProviderAccount = {
  provider: 'github',
  externalAccountId: '42',
  login: 'octocat',
  name: 'Alex',
  avatarUrl: 'https://example.com/avatar.png',
  emails: ['alex@example.com'],
}

export const createFakeOAuthClient = () => {
  const revoked: string[] = []
  const client: ProviderOAuthClient = {
    buildAuthorizeUrl: (state) => `https://provider.example/authorize?state=${state}`,
    async exchangeCode() {
      return { accessToken: 'gh-token', scopes: ['repo'] }
    },
    async fetchAccount() {
      return fakeAccount
    },
    async revokeGrant(accessToken) {
      revoked.push(accessToken)
    },
  }
  return { client, revoked }
}

export type FakeProviderPlan = {
  projects: SourceProject[]
  activitiesByProject: Record<string, SourceActivity[] | Error>
}

export const createFakeActivityProvider = (plan: FakeProviderPlan): ActivityProvider => ({
  async fetchAccount() {
    return fakeAccount
  },
  async *fetchProjects() {
    yield plan.projects
  },
  async *fetchProjectActivities({ project }) {
    const outcome = plan.activitiesByProject[project.fullName]
    if (outcome instanceof Error) {
      throw outcome
    }
    if (outcome && outcome.length > 0) {
      yield outcome
    }
  },
})

export const sourceProject = (overrides: Partial<SourceProject> = {}): SourceProject => ({
  provider: 'github',
  externalId: '1001',
  name: 'tracely',
  fullName: 'octocat/tracely',
  ownerLogin: 'octocat',
  description: null,
  visibility: 'public',
  isFork: false,
  isArchived: false,
  defaultBranch: 'main',
  primaryLanguage: 'TypeScript',
  providerCreatedAt: new Date('2026-01-01T00:00:00Z'),
  providerPushedAt: new Date('2026-07-01T00:00:00Z'),
  ...overrides,
})

export const sourceCommit = (overrides: Partial<SourceActivity> = {}): SourceActivity => ({
  provider: 'github',
  type: 'commit',
  externalId: `sha-${randomUUID()}`,
  title: 'feat: add feature',
  summary: null,
  url: 'https://github.com/octocat/tracely/commit/abc',
  actor: { externalId: '42', login: 'octocat', isConnectedUser: true, isBot: false },
  occurredAt: new Date('2026-07-10T12:00:00Z'),
  details: {
    kind: 'commit',
    sha: 'abc123',
    message: 'feat: add feature',
    authorName: 'Alex',
    authorEmail: 'alex@example.com',
    branch: 'main',
    additions: 10,
    deletions: 2,
    filesChanged: 1,
    files: [{ path: 'src/index.ts', status: 'modified', additions: 10, deletions: 2 }],
    filesTruncated: false,
  },
  ...overrides,
})
