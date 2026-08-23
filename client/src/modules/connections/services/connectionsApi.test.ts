import { afterEach, describe, expect, it, vi } from 'vitest'

import { githubConnection, stubGraphQL } from '@/test/graphql'
import { GraphQLRequestError } from '@/shared/lib/graphql'
import {
  disconnectProvider,
  fetchConnections,
  startProviderConnection,
  syncConnections,
} from './connectionsApi'


afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

const lastRequest = (fetchMock: ReturnType<typeof stubGraphQL>) =>
  JSON.parse(String(fetchMock.mock.calls.at(-1)?.[1]?.body)) as {
    query: string
    variables?: Record<string, unknown>
  }

describe('connectionsApi', () => {
  it('reads the connections of the current session', async () => {
    const fetchMock = stubGraphQL(() => ({ data: { connections: [githubConnection] } }))

    await expect(fetchConnections()).resolves.toEqual([githubConnection])
    expect(lastRequest(fetchMock).query).toContain('query Connections')
  })

  it('asks the BFF where to send the reader to authorize', async () => {
    const fetchMock = stubGraphQL(() => ({
      data: { connectProvider: { authorizeUrl: 'https://github.com/login/oauth' } },
    }))

    await expect(startProviderConnection('GITHUB')).resolves.toBe('https://github.com/login/oauth')
    expect(lastRequest(fetchMock).variables).toEqual({ provider: 'GITHUB' })
  })

  it('disconnects by connection id', async () => {
    const fetchMock = stubGraphQL(() => ({ data: { disconnectProvider: true } }))

    await disconnectProvider('conn-1')

    expect(lastRequest(fetchMock).variables).toEqual({ connectionId: 'conn-1' })
  })

  it('waits for a triggered sync until it stops running', async () => {
    vi.useFakeTimers()
    const statuses = ['RUNNING', 'SUCCEEDED']
    const fetchMock = stubGraphQL((body) =>
      body.query.includes('TriggerSync')
        ? { data: { triggerSync: { status: 'RUNNING' } } }
        : { data: { syncStatus: { status: statuses.shift() } } },
    )

    const settled = vi.fn()
    const pending = syncConnections(['conn-1']).then(settled)

    await vi.advanceTimersByTimeAsync(1500)
    expect(settled).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1500)
    await pending

    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('does not poll when the sync came back already settled', async () => {
    const fetchMock = stubGraphQL(() => ({ data: { triggerSync: { status: 'SUCCEEDED' } } }))

    await syncConnections(['conn-1'])

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(lastRequest(fetchMock).variables).toEqual({ connectionId: 'conn-1' })
  })

  it('swallows a sync refusal so generation can read what is already stored', async () => {
    stubGraphQL(() => ({
      errors: [{ message: 'Not found', extensions: { code: 'NOT_FOUND' } }],
    }))

    await expect(syncConnections(['conn-1'])).resolves.toBeUndefined()
  })

  it('surfaces the GraphQL error code to the caller', async () => {
    stubGraphQL(() => ({
      errors: [{ message: 'Not found', extensions: { code: 'NOT_FOUND' } }],
    }))

    const attempt = disconnectProvider('missing')

    await expect(attempt).rejects.toBeInstanceOf(GraphQLRequestError)
    await attempt.catch((error: GraphQLRequestError) => {
      expect(error.code).toBe('NOT_FOUND')
    })
  })
})
