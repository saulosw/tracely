import type { SessionRepository } from '../../repositories/index.js'
import type { TokenGenerator } from '../../security/index.js'


const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000

export type IssuedSession = {
  token: string
  expiresAt: Date
}

export const issueSession = async (
  deps: { sessionRepository: SessionRepository; tokenGenerator: TokenGenerator },
  userId: string,
): Promise<IssuedSession> => {
  const token = deps.tokenGenerator.generate()
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
  await deps.sessionRepository.create({
    userId,
    tokenHash: deps.tokenGenerator.hash(token),
    expiresAt,
  })
  return { token, expiresAt }
}
