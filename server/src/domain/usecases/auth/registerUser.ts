import { z } from 'zod'

import { ConflictError } from '../../errors/index.js'
import { parseInput } from '../parseInput.js'
import { issueSession } from './createSession.js'

import type { User } from '../../entities/index.js'
import type { SessionRepository, UserRepository } from '../../repositories/index.js'
import type { PasswordHasher, TokenGenerator } from '../../security/index.js'


const FIRST_NAME_PATTERN = /^\p{L}+$/u
const HAS_LOWERCASE = /\p{Ll}/u
const HAS_UPPERCASE = /\p{Lu}/u
const HAS_DIGIT = /\d/
const HAS_SPECIAL = /[^\p{L}\p{N}]/u

const registerInputSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must have at least 2 characters')
    .max(30, 'First name must have at most 30 characters')
    .regex(FIRST_NAME_PATTERN, 'First name must contain only letters'),
  email: z
    .string()
    .trim()
    .max(254, 'Email must have at most 254 characters')
    .pipe(z.email('Email must be valid'))
    .transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(8, 'Password must have at least 8 characters')
    .max(64, 'Password must have at most 64 characters')
    .regex(HAS_UPPERCASE, 'Password must contain an uppercase letter')
    .regex(HAS_LOWERCASE, 'Password must contain a lowercase letter')
    .regex(HAS_DIGIT, 'Password must contain a digit')
    .regex(HAS_SPECIAL, 'Password must contain a special character'),
})

export type RegisterUserInput = {
  firstName: string
  email: string
  password: string
}

export type AuthResult = {
  user: User
  sessionToken: string
  sessionExpiresAt: Date
}

export type RegisterUser = (input: RegisterUserInput) => Promise<AuthResult>

export const makeRegisterUser = (deps: {
  userRepository: UserRepository
  sessionRepository: SessionRepository
  passwordHasher: PasswordHasher
  tokenGenerator: TokenGenerator
}): RegisterUser => {
  return async (rawInput) => {
    const input = parseInput(registerInputSchema, rawInput)

    const existing = await deps.userRepository.findByEmail(input.email)
    if (existing) {
      throw new ConflictError('Email is already registered')
    }

    const passwordHash = await deps.passwordHasher.hash(input.password)
    const user = await deps.userRepository.create({
      firstName: input.firstName,
      email: input.email,
      passwordHash,
    })

    const session = await issueSession(deps, user.id)
    return { user, sessionToken: session.token, sessionExpiresAt: session.expiresAt }
  }
}
