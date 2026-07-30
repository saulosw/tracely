import { describe, expect, it } from 'vitest'

import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  createProviderRegistry,
  makeCompleteProviderConnection,
  makeDisconnectProvider,
  makeStartProviderConnection,
} from '../../src/domain/index.js'
import {
  createFakeConnectionRepository,
  createFakeOAuthClient,
  createFakeOAuthStateRepository,
  createFakeTokenGenerator,
  fakeTokenCipher,
} from '../fakes/fakes.js'


const setup = () => {
  const oauthStates = createFakeOAuthStateRepository()
  const connections = createFakeConnectionRepository()
  const oauthClient = createFakeOAuthClient()
  const oauthClients = createProviderRegistry({ github: oauthClient.client })
  return {
    oauthStates,
    connections,
    oauthClient,
    startProviderConnection: makeStartProviderConnection({
      oauthStateRepository: oauthStates.repository,
      oauthClients,
      tokenGenerator: createFakeTokenGenerator(),
    }),
    completeProviderConnection: makeCompleteProviderConnection({
      oauthStateRepository: oauthStates.repository,
      connectionRepository: connections.repository,
      oauthClients,
      tokenCipher: fakeTokenCipher,
    }),
    disconnectProvider: makeDisconnectProvider({
      connectionRepository: connections.repository,
      oauthClients,
      tokenCipher: fakeTokenCipher,
    }),
  }
}

describe('startProviderConnection', () => {
  it('stores a single-use state bound to the user and returns the authorize url', async () => {
    const { startProviderConnection, oauthStates } = setup()

    const { authorizeUrl } = await startProviderConnection({
      userId: 'user-1',
      provider: 'github',
    })

    expect(oauthStates.states).toHaveLength(1)
    const stored = oauthStates.states[0]!
    expect(stored.userId).toBe('user-1')
    expect(stored.provider).toBe('github')
    expect(stored.expiresAt.getTime()).toBeGreaterThan(Date.now())
    expect(authorizeUrl).toBe(`https://provider.example/authorize?state=${stored.state}`)
  })
})

describe('completeProviderConnection', () => {
  it('stores the connection with an encrypted token and consumes the state', async () => {
    const { startProviderConnection, completeProviderConnection, connections } = setup()
    await startProviderConnection({ userId: 'user-1', provider: 'github' })

    const connection = await completeProviderConnection({
      userId: 'user-1',
      provider: 'github',
      state: 'token-1',
      code: 'oauth-code',
    })

    expect(connection.encryptedAccessToken).toBe('enc:gh-token')
    expect(connection.accountLogin).toBe('octocat')
    expect(connection.scopes).toEqual(['repo'])
    expect(connections.connections).toHaveLength(1)

    await expect(
      completeProviderConnection({
        userId: 'user-1',
        provider: 'github',
        state: 'token-1',
        code: 'oauth-code',
      }),
    ).rejects.toBeInstanceOf(AuthenticationError)
  })

  it('rejects an unknown state', async () => {
    const { completeProviderConnection } = setup()
    await expect(
      completeProviderConnection({
        userId: 'user-1',
        provider: 'github',
        state: 'missing',
        code: 'oauth-code',
      }),
    ).rejects.toBeInstanceOf(AuthenticationError)
  })

  it('rejects an expired state', async () => {
    const { startProviderConnection, completeProviderConnection, oauthStates } = setup()
    await startProviderConnection({ userId: 'user-1', provider: 'github' })
    oauthStates.states[0]!.expiresAt = new Date(Date.now() - 1000)

    await expect(
      completeProviderConnection({
        userId: 'user-1',
        provider: 'github',
        state: 'token-1',
        code: 'oauth-code',
      }),
    ).rejects.toBeInstanceOf(AuthenticationError)
  })

  it('rejects a state that belongs to another user', async () => {
    const { startProviderConnection, completeProviderConnection } = setup()
    await startProviderConnection({ userId: 'user-1', provider: 'github' })

    await expect(
      completeProviderConnection({
        userId: 'user-2',
        provider: 'github',
        state: 'token-1',
        code: 'oauth-code',
      }),
    ).rejects.toBeInstanceOf(AuthenticationError)
  })

  it('reconnecting the same account updates it instead of duplicating', async () => {
    const { startProviderConnection, completeProviderConnection, connections } = setup()
    await startProviderConnection({ userId: 'user-1', provider: 'github' })
    await completeProviderConnection({
      userId: 'user-1',
      provider: 'github',
      state: 'token-1',
      code: 'oauth-code',
    })
    await startProviderConnection({ userId: 'user-1', provider: 'github' })
    await completeProviderConnection({
      userId: 'user-1',
      provider: 'github',
      state: 'token-2',
      code: 'another-code',
    })

    expect(connections.connections).toHaveLength(1)
  })
})

describe('disconnectProvider', () => {
  it('revokes the grant with the decrypted token and deletes the connection', async () => {
    const { startProviderConnection, completeProviderConnection, disconnectProvider, connections, oauthClient } =
      setup()
    await startProviderConnection({ userId: 'user-1', provider: 'github' })
    const connection = await completeProviderConnection({
      userId: 'user-1',
      provider: 'github',
      state: 'token-1',
      code: 'oauth-code',
    })

    await disconnectProvider({ userId: 'user-1', connectionId: connection.id })

    expect(oauthClient.revoked).toEqual(['gh-token'])
    expect(connections.connections).toHaveLength(0)
  })

  it('rejects a connection that does not exist', async () => {
    const { disconnectProvider } = setup()
    await expect(
      disconnectProvider({ userId: 'user-1', connectionId: 'missing' }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('rejects a connection owned by another user', async () => {
    const { startProviderConnection, completeProviderConnection, disconnectProvider } = setup()
    await startProviderConnection({ userId: 'user-1', provider: 'github' })
    const connection = await completeProviderConnection({
      userId: 'user-1',
      provider: 'github',
      state: 'token-1',
      code: 'oauth-code',
    })

    await expect(
      disconnectProvider({ userId: 'user-2', connectionId: connection.id }),
    ).rejects.toBeInstanceOf(AuthorizationError)
  })
})
