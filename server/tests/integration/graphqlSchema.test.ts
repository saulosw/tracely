import { createYoga } from 'graphql-yoga'
import { pino } from 'pino'
import { describe, expect, it, vi } from 'vitest'

import { ConflictError, ValidationError } from '../../src/domain/index.js'
import { createMaskError, schema } from '../../src/infra/graphql/index.js'

import type { UseCases, User } from '../../src/domain/index.js'
import type { GraphQLContext } from '../../src/infra/graphql/index.js'


const testUser: User = {
  id: 'user-1',
  firstName: 'Alex',
  email: 'alex@example.com',
  passwordHash: 'hashed',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const buildYoga = (useCases: Partial<UseCases>, currentUser: User | null = null) => {
  const setSessionCookie = vi.fn()
  const clearSessionCookie = vi.fn()
  const logger = pino({ level: 'silent' })
  const yoga = createYoga({
    schema,
    maskedErrors: { maskError: createMaskError(logger) },
    context: (): GraphQLContext => ({
      useCases: useCases as UseCases,
      logger,
      currentUser,
      sessionToken: currentUser ? 'session-token' : null,
      setSessionCookie,
      clearSessionCookie,
    }),
  })
  return { yoga, setSessionCookie, clearSessionCookie, logger }
}

const execute = async (
  yoga: ReturnType<typeof buildYoga>['yoga'],
  query: string,
  variables?: Record<string, unknown>,
) => {
  const response = await yoga.fetch('http://server/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  return (await response.json()) as {
    data?: Record<string, unknown> | null
    errors?: { message: string; extensions?: Record<string, unknown> }[]
  }
}

describe('graphql schema', () => {
  it('resolves me as null when unauthenticated', async () => {
    const { yoga } = buildYoga({})
    const result = await execute(yoga, '{ me { id } }')
    expect(result.data?.me).toBeNull()
    expect(result.errors).toBeUndefined()
  })

  it('registers a user and sets the session cookie', async () => {
    const expiresAt = new Date('2026-08-25T00:00:00Z')
    const registerUser = vi.fn().mockResolvedValue({
      user: testUser,
      sessionToken: 'new-session-token',
      sessionExpiresAt: expiresAt,
    })
    const { yoga, setSessionCookie } = buildYoga({ registerUser })

    const result = await execute(
      yoga,
      `mutation Register($input: RegisterInput!) {
        register(input: $input) { user { id firstName email } }
      }`,
      { input: { firstName: 'Alex', email: 'alex@example.com', password: 'S3nha!forte' } },
    )

    expect(result.errors).toBeUndefined()
    expect(result.data?.register).toEqual({
      user: { id: 'user-1', firstName: 'Alex', email: 'alex@example.com' },
    })
    expect(registerUser).toHaveBeenCalledWith({
      firstName: 'Alex',
      email: 'alex@example.com',
      password: 'S3nha!forte',
    })
    expect(setSessionCookie).toHaveBeenCalledWith('new-session-token', expiresAt)
  })

  it('surfaces domain error codes through extensions', async () => {
    const registerUser = vi.fn().mockRejectedValue(new ConflictError('Email is already registered'))
    const { yoga } = buildYoga({ registerUser })

    const result = await execute(
      yoga,
      `mutation Register($input: RegisterInput!) {
        register(input: $input) { user { id } }
      }`,
      { input: { firstName: 'Alex', email: 'alex@example.com', password: 'S3nha!forte' } },
    )

    expect(result.errors?.[0]?.message).toBe('Email is already registered')
    expect(result.errors?.[0]?.extensions?.code).toBe('CONFLICT')
  })

  it('exposes validation field details', async () => {
    const registerUser = vi
      .fn()
      .mockRejectedValue(new ValidationError('Invalid input', { password: 'Too weak' }))
    const { yoga } = buildYoga({ registerUser })

    const result = await execute(
      yoga,
      `mutation Register($input: RegisterInput!) {
        register(input: $input) { user { id } }
      }`,
      { input: { firstName: 'Alex', email: 'alex@example.com', password: 'x' } },
    )

    expect(result.errors?.[0]?.extensions?.code).toBe('VALIDATION')
    expect(result.errors?.[0]?.extensions?.fields).toEqual({ password: 'Too weak' })
  })

  it('masks unexpected errors', async () => {
    const registerUser = vi.fn().mockRejectedValue(new Error('pg: connection refused'))
    const { yoga } = buildYoga({ registerUser })

    const result = await execute(
      yoga,
      `mutation Register($input: RegisterInput!) {
        register(input: $input) { user { id } }
      }`,
      { input: { firstName: 'Alex', email: 'alex@example.com', password: 'S3nha!forte' } },
    )

    expect(result.errors?.[0]?.message).not.toContain('pg: connection refused')
    expect(result.errors?.[0]?.extensions?.code).toBe('INTERNAL_SERVER_ERROR')
  })

  it('requires authentication for connections', async () => {
    const { yoga } = buildYoga({})
    const result = await execute(yoga, '{ connections { id } }')
    expect(result.errors?.[0]?.extensions?.code).toBe('UNAUTHENTICATED')
  })

  it('never exposes token fields on Connection', async () => {
    const { yoga } = buildYoga({}, testUser)
    const result = await execute(yoga, '{ connections { id encryptedAccessToken } }')
    expect(result.errors?.[0]?.message).toContain('Cannot query field')
  })

  it('lists the connections of the signed-in user', async () => {
    const listConnections = vi.fn().mockResolvedValue([
      {
        id: 'conn-1',
        provider: 'github',
        accountLogin: 'octocat',
        accountName: 'Alex',
        avatarUrl: null,
        status: 'active',
        lastSyncedAt: null,
        createdAt: new Date('2026-07-01T00:00:00Z'),
      },
    ])
    const { yoga } = buildYoga({ listConnections }, testUser)

    const result = await execute(yoga, '{ connections { id provider accountLogin status } }')

    expect(result.data?.connections).toEqual([
      { id: 'conn-1', provider: 'GITHUB', accountLogin: 'octocat', status: 'ACTIVE' },
    ])
    expect(listConnections).toHaveBeenCalledWith('user-1')
  })

  it('starts a provider connection and returns the authorize url', async () => {
    const startProviderConnection = vi
      .fn()
      .mockResolvedValue({ authorizeUrl: 'https://github.com/login/oauth/authorize?state=abc' })
    const { yoga } = buildYoga({ startProviderConnection }, testUser)

    const result = await execute(
      yoga,
      'mutation { connectProvider(provider: GITHUB) { authorizeUrl } }',
    )

    expect(result.data?.connectProvider).toEqual({
      authorizeUrl: 'https://github.com/login/oauth/authorize?state=abc',
    })
    expect(startProviderConnection).toHaveBeenCalledWith({
      userId: 'user-1',
      provider: 'github',
    })
  })

  it('requires authentication to start a provider connection', async () => {
    const startProviderConnection = vi.fn()
    const { yoga } = buildYoga({ startProviderConnection })

    const result = await execute(
      yoga,
      'mutation { connectProvider(provider: GITHUB) { authorizeUrl } }',
    )

    expect(result.errors?.[0]?.extensions?.code).toBe('UNAUTHENTICATED')
    expect(startProviderConnection).not.toHaveBeenCalled()
  })

  it('disconnects a provider on behalf of the signed-in user', async () => {
    const disconnectProvider = vi.fn().mockResolvedValue(undefined)
    const { yoga } = buildYoga({ disconnectProvider }, testUser)

    const result = await execute(yoga, 'mutation { disconnectProvider(connectionId: "conn-1") }')

    expect(result.data?.disconnectProvider).toBe(true)
    expect(disconnectProvider).toHaveBeenCalledWith({
      userId: 'user-1',
      connectionId: 'conn-1',
    })
  })

  it('requires authentication to disconnect a provider', async () => {
    const disconnectProvider = vi.fn()
    const { yoga } = buildYoga({ disconnectProvider })

    const result = await execute(yoga, 'mutation { disconnectProvider(connectionId: "conn-1") }')

    expect(result.errors?.[0]?.extensions?.code).toBe('UNAUTHENTICATED')
    expect(disconnectProvider).not.toHaveBeenCalled()
  })

  it('logs out by deleting the session and clearing the cookie', async () => {
    const logoutUser = vi.fn().mockResolvedValue(undefined)
    const { yoga, clearSessionCookie } = buildYoga({ logoutUser }, testUser)

    const result = await execute(yoga, 'mutation { logout }')

    expect(result.data?.logout).toBe(true)
    expect(logoutUser).toHaveBeenCalledWith('session-token')
    expect(clearSessionCookie).toHaveBeenCalled()
  })

  it('triggers a sync and returns the running run without awaiting completion', async () => {
    const run = {
      id: 'run-1',
      connectionId: 'conn-1',
      status: 'running',
      startedAt: new Date(),
      finishedAt: null,
      stats: { projects: 0, activities: {}, projectErrors: [] },
      error: null,
    }
    const syncConnection = vi.fn().mockResolvedValue({ run, completion: Promise.resolve() })
    const { yoga } = buildYoga({ syncConnection }, testUser)

    const result = await execute(
      yoga,
      'mutation { triggerSync(connectionId: "conn-1") { id status } }',
    )

    expect(result.data?.triggerSync).toEqual({ id: 'run-1', status: 'RUNNING' })
    expect(syncConnection).toHaveBeenCalledWith({ userId: 'user-1', connectionId: 'conn-1' })
  })

  it('logs a failing background sync instead of leaving the rejection unhandled', async () => {
    const run = {
      id: 'run-1',
      connectionId: 'conn-1',
      status: 'running',
      startedAt: new Date(),
      finishedAt: null,
      stats: { projects: 0, activities: {}, projectErrors: [] },
      error: null,
    }
    const completion = new Promise<void>((_resolve, reject) => {
      setTimeout(() => reject(new Error('db down while finishing run')), 0)
    })
    const syncConnection = vi.fn().mockResolvedValue({ run, completion })
    const { yoga, logger } = buildYoga({ syncConnection }, testUser)
    const logged = vi.spyOn(logger, 'error')

    const result = await execute(
      yoga,
      'mutation { triggerSync(connectionId: "conn-1") { id status } }',
    )
    await completion.catch(() => undefined)

    expect(result.errors).toBeUndefined()
    expect(result.data?.triggerSync).toEqual({ id: 'run-1', status: 'RUNNING' })
    expect(logged).toHaveBeenCalledWith(
      expect.objectContaining({ runId: 'run-1' }),
      'background sync failed',
    )
  })
})
