import { AuthorizationError, NotFoundError } from '../../errors/index.js'

import type { ProviderOAuthClient, ProviderRegistry } from '../../providers/index.js'
import type { ConnectionRepository } from '../../repositories/index.js'
import type { TokenCipher } from '../../security/index.js'


export type DisconnectProviderInput = {
  userId: string
  connectionId: string
}

export type DisconnectProvider = (input: DisconnectProviderInput) => Promise<void>

export const makeDisconnectProvider = (deps: {
  connectionRepository: ConnectionRepository
  oauthClients: ProviderRegistry<ProviderOAuthClient>
  tokenCipher: TokenCipher
}): DisconnectProvider => {
  return async ({ userId, connectionId }) => {
    const connection = await deps.connectionRepository.findById(connectionId)
    if (!connection) {
      throw new NotFoundError('Connection not found')
    }
    if (connection.userId !== userId) {
      throw new AuthorizationError('Connection belongs to another user')
    }

    await deps.oauthClients
      .get(connection.provider)
      .revokeGrant(deps.tokenCipher.decrypt(connection.encryptedAccessToken))

    await deps.connectionRepository.delete(connectionId)
  }
}
