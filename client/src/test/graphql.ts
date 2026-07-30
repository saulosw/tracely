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

export function authenticatedSession(connections: unknown[] = []) {
  return (body: GraphQLRequestBody): GraphQLResult =>
    body.query.includes('Connections')
      ? { data: { connections } }
      : { data: { me: authenticatedUser } }
}
