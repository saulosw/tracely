import type { User } from '../../entities/index.js'
import type { SessionRepository, UserRepository } from '../../repositories/index.js'
import type { TokenGenerator } from '../../security/index.js'


export type GetSessionUser = (sessionToken: string) => Promise<User | null>

export const makeGetSessionUser = (deps: {
  sessionRepository: SessionRepository
  userRepository: UserRepository
  tokenGenerator: TokenGenerator
}): GetSessionUser => {
  return async (sessionToken) => {
    const session = await deps.sessionRepository.findActiveByTokenHash(
      deps.tokenGenerator.hash(sessionToken),
      new Date(),
    )
    if (!session) {
      return null
    }
    return deps.userRepository.findById(session.userId)
  }
}
