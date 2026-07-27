import type { Provider } from '../../entities/index.js'
import type { ProviderOAuthClient, ProviderRegistry } from '../../providers/index.js'
import type { OAuthStateRepository } from '../../repositories/index.js'
import type { TokenGenerator } from '../../security/index.js'


const STATE_TTL_MS = 10 * 60 * 1000

export type StartProviderConnectionInput = {
  userId: string
  provider: Provider
}

export type StartProviderConnection = (
  input: StartProviderConnectionInput,
) => Promise<{ authorizeUrl: string }>

export const makeStartProviderConnection = (deps: {
  oauthStateRepository: OAuthStateRepository
  oauthClients: ProviderRegistry<ProviderOAuthClient>
  tokenGenerator: TokenGenerator
}): StartProviderConnection => {
  return async ({ userId, provider }) => {
    const state = deps.tokenGenerator.generate()
    await deps.oauthStateRepository.create({
      state,
      userId,
      provider,
      expiresAt: new Date(Date.now() + STATE_TTL_MS),
    })
    return { authorizeUrl: deps.oauthClients.get(provider).buildAuthorizeUrl(state) }
  }
}
