import { vi } from 'vitest'


export type GraphQLRequestBody = {
  query: string
  variables?: Record<string, unknown>
}

export type GraphQLResult = {
  data?: unknown
  errors?: { message: string; extensions?: Record<string, unknown> }[]
}

export function stubGraphQL(
  handler: (body: GraphQLRequestBody) => GraphQLResult | Promise<GraphQLResult>,
) {
  const fetchMock = vi.fn(async (_input: unknown, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body)) as GraphQLRequestBody
    const result = await handler(body)
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  })

  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

export const anonymousSession = (): GraphQLResult => ({ data: { me: null, connections: [] } })

export const authenticatedUser = {
  id: 'user-1',
  firstName: 'Alex',
  email: 'alex@exemplo.com',
}

export const githubConnection = {
  id: 'conn-1',
  provider: 'GITHUB',
  accountLogin: 'octocat',
  accountName: 'Alex',
  avatarUrl: null,
  status: 'ACTIVE',
  lastSyncedAt: null,
  createdAt: '2026-07-01T00:00:00.000Z',
}

export function authenticatedSession(
  connections: unknown[] = [],
  responses: Record<string, unknown> = {},
) {
  const byOperation: Record<string, unknown> = { Connections: { connections }, ...responses }
  const operations = Object.keys(byOperation).sort((first, second) => second.length - first.length)

  return (body: GraphQLRequestBody): GraphQLResult => {
    const match = operations.find((operation) => body.query.includes(operation))
    return match ? { data: byOperation[match] } : { data: { me: authenticatedUser } }
  }
}

export const journalArtifactPayload = {
  id: 'artifact-1',
  kind: 'JOURNAL',
  period: 'WEEK',
  from: '2026-07-27T03:00:00.000Z',
  to: '2026-08-03T02:59:59.999Z',
  timezone: 'America/Sao_Paulo',
  providers: ['GITHUB'],
  activityCount: 12,
  generatedAt: '2026-08-03T12:00:00.000Z',
  versions: [
    { id: 'artifact-1', generatedAt: '2026-08-03T12:00:00.000Z' },
    { id: 'artifact-0', generatedAt: '2026-08-01T09:00:00.000Z' },
  ],
  journal: {
    granularity: 'DAY',
    activityCount: 12,
    truncated: false,
    sections: [
      {
        from: '2026-07-31',
        to: '2026-07-31',
        overflow: 0,
        entries: [
          {
            id: 'pr-501',
            provider: 'GITHUB',
            type: 'PULL_REQUEST',
            variant: 'merged',
            reference: '#501',
            title: 'nova camada de dispatch',
            project: 'octocat/hello-world',
            count: 1,
            url: 'https://github.com/octocat/hello-world/pull/501',
            at: '2026-07-31T17:20:00.000Z',
            measures: [
              { key: 'linesAdded', value: 410, partial: false },
              { key: 'linesRemoved', value: 180, partial: false },
            ],
            items: [],
          },
          {
            id: 'commits-2026-07-31',
            provider: 'GITHUB',
            type: 'COMMIT',
            variant: null,
            reference: null,
            title: '',
            project: 'octocat/hello-world',
            count: 6,
            url: null,
            at: null,
            measures: [{ key: 'linesAdded', value: 120, partial: true }],
            items: [
              {
                id: 'commit-a',
                title: 'ajusta o retry do dispatch',
                url: 'https://github.com/octocat/hello-world/commit/aaa',
                at: '2026-07-31T16:00:00.000Z',
              },
              {
                id: 'commit-b',
                title: 'renomeia o worker',
                url: 'https://github.com/octocat/hello-world/commit/bbb',
                at: '2026-07-31T14:30:00.000Z',
              },
            ],
          },
        ],
      },
      {
        from: '2026-07-25',
        to: '2026-07-26',
        overflow: 3,
        entries: [
          {
            id: 'commits-weekend',
            provider: 'GITHUB',
            type: 'COMMIT',
            variant: null,
            reference: null,
            title: '',
            project: 'dotfiles',
            count: 27,
            url: null,
            at: null,
            measures: [],
            items: [],
          },
        ],
      },
    ],
  },
}

export const journalSummaryPayload = {
  id: 'artifact-1',
  kind: 'JOURNAL',
  from: '2026-07-27T03:00:00.000Z',
  to: '2026-08-03T02:59:59.999Z',
  timezone: 'America/Sao_Paulo',
  activityCount: 12,
  generatedAt: '2026-08-03T12:00:00.000Z',
}
