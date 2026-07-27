import type { SessionRepository } from '../../repositories/index.js'
import type { TokenGenerator } from '../../security/index.js'


export type LogoutUser = (sessionToken: string) => Promise<void>

export const makeLogoutUser = (deps: {
  sessionRepository: SessionRepository
  tokenGenerator: TokenGenerator
}): LogoutUser => {
  return async (sessionToken) => {
    await deps.sessionRepository.deleteByTokenHash(deps.tokenGenerator.hash(sessionToken))
  }
}
