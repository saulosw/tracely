import { AuthenticationError } from '../../errors/index.js'

import type { Connection, Provider } from '../../entities/index.js'
import type { ProviderOAuthClient, ProviderRegistry } from '../../providers/index.js'
import type { ConnectionRepository, OAuthStateRepository } from '../../repositories/index.js'
import type { TokenCipher } from '../../security/index.js'


export type CompleteProviderConnectionInput = {
  userId: string | null
  provider: Provider
  state: string
  code: string
}

export type CompleteProviderConnection = (
  input: CompleteProviderConnectionInput,
) => Promise<Connection>

export const makeCompleteProviderConnection = (deps: {
  oauthStateRepository: OAuthStateRepository
  connectionRepository: ConnectionRepository
  oauthClients: ProviderRegistry<ProviderOAuthClient>
  tokenCipher: TokenCipher
}): CompleteProviderConnection => {
  return async ({ userId, provider, state, code }) => {
    const stored = await deps.oauthStateRepository.consume(state)
    if (!stored || stored.provider !== provider) {
      throw new AuthenticationError('Invalid OAuth state')
    }
    if (stored.expiresAt.getTime() < Date.now()) {
      throw new AuthenticationError('OAuth state has expired')
    }
    if (!userId || stored.userId !== userId) {
      throw new AuthenticationError('OAuth state does not belong to the signed-in user')
    }

    const client = deps.oauthClients.get(provider)
    const { accessToken, scopes } = await client.exchangeCode(code)
    const account = await client.fetchAccount(accessToken)

    return deps.connectionRepository.upsert({
      userId,
      provider,
      externalAccountId: account.externalAccountId,
      accountLogin: account.login,
      accountName: account.name,
      avatarUrl: account.avatarUrl,
      encryptedAccessToken: deps.tokenCipher.encrypt(accessToken),
      scopes,
      status: 'active',
      syncCursor: {},
      lastSyncedAt: null,
    })
  }
}
