import { z } from 'zod'

import { AuthenticationError } from '../../errors/index.js'
import { parseInput } from '../parseInput.js'
import { issueSession } from './createSession.js'

import type { SessionRepository, UserRepository } from '../../repositories/index.js'
import type { PasswordHasher, TokenGenerator } from '../../security/index.js'
import type { AuthResult } from './registerUser.js'


const loginInputSchema = z.object({
  email: z
    .string()
    .trim()
    .max(254, 'Email must have at most 254 characters')
    .pipe(z.email('Email must be valid'))
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1, 'Password is required').max(64, 'Password is too long'),
})

export type LoginUserInput = {
  email: string
  password: string
}

export type LoginUser = (input: LoginUserInput) => Promise<AuthResult>

export const makeLoginUser = (deps: {
  userRepository: UserRepository
  sessionRepository: SessionRepository
  passwordHasher: PasswordHasher
  tokenGenerator: TokenGenerator
}): LoginUser => {
  return async (rawInput) => {
    const input = parseInput(loginInputSchema, rawInput)

    const user = await deps.userRepository.findByEmail(input.email)
    if (!user) {
      await deps.passwordHasher.hash(input.password)
      throw new AuthenticationError('Invalid email or password')
    }

    const valid = await deps.passwordHasher.verify(input.password, user.passwordHash)
    if (!valid) {
      throw new AuthenticationError('Invalid email or password')
    }

    const session = await issueSession(deps, user.id)
    return { user, sessionToken: session.token, sessionExpiresAt: session.expiresAt }
  }
}
