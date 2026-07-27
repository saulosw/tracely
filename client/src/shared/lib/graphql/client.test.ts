import { afterEach, describe, expect, it, vi } from 'vitest'

import { graphqlRequest } from './client'
import { GraphQLRequestError } from './errors'


afterEach(() => {
  vi.unstubAllGlobals()
})

const respondWith = (body: unknown) =>
  vi.fn(
    async (_input: unknown, _init?: RequestInit) =>
      new Response(JSON.stringify(body), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
  )

describe('graphqlRequest', () => {
  it('posts the document with the session cookie attached', async () => {
    const fetchMock = respondWith({ data: { me: null } })
    vi.stubGlobal('fetch', fetchMock)

    await expect(graphqlRequest('query Me { me { id } }')).resolves.toEqual({ me: null })

    const init = fetchMock.mock.calls[0]?.[1]
    expect(init?.method).toBe('POST')
    expect(init?.credentials).toBe('include')
  })

  it('turns a 200 response carrying errors into a GraphQLRequestError', async () => {
    vi.stubGlobal(
      'fetch',
      respondWith({
        data: null,
        errors: [
          {
            message: 'Invalid input',
            extensions: { code: 'VALIDATION', fields: { password: 'Too weak' } },
          },
        ],
      }),
    )

    const attempt = graphqlRequest('mutation Register { register { user { id } } }')

    await expect(attempt).rejects.toBeInstanceOf(GraphQLRequestError)
    await attempt.catch((error: GraphQLRequestError) => {
      expect(error.code).toBe('VALIDATION')
      expect(error.fields).toEqual({ password: 'Too weak' })
    })
  })

  it('reports a failed request as a network error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )

    const attempt = graphqlRequest('query Me { me { id } }')

    await expect(attempt).rejects.toBeInstanceOf(GraphQLRequestError)
    await attempt.catch((error: GraphQLRequestError) => {
      expect(error.code).toBe('NETWORK')
    })
  })
})
