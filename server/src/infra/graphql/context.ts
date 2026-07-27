import { AuthenticationError } from '../../domain/index.js'

import type { UseCases, User } from '../../domain/index.js'
import type { Logger } from '../logging/index.js'


export type GraphQLContext = {
  useCases: UseCases
  logger: Logger
  currentUser: User | null
  sessionToken: string | null
  setSessionCookie(token: string, expiresAt: Date): void
  clearSessionCookie(): void
}

export const requireUser = (context: GraphQLContext): User => {
  if (!context.currentUser) {
    throw new AuthenticationError()
  }
  return context.currentUser
}
