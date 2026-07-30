import { describe, expect, it } from 'vitest'

import { ConflictError, ValidationError, makeRegisterUser } from '../../src/domain/index.js'
import {
  createFakeSessionRepository,
  createFakeTokenGenerator,
  createFakeUserRepository,
  fakePasswordHasher,
} from '../fakes/fakes.js'


const setup = () => {
  const users = createFakeUserRepository()
  const sessions = createFakeSessionRepository()
  const registerUser = makeRegisterUser({
    userRepository: users.repository,
    sessionRepository: sessions.repository,
    passwordHasher: fakePasswordHasher,
    tokenGenerator: createFakeTokenGenerator(),
  })
  return { users, sessions, registerUser }
}

const validInput = {
  firstName: 'Alex',
  email: 'Alex@Example.com',
  password: 'S3nha!forte',
}

describe('registerUser', () => {
  it('creates the user with a lowercased email and a hashed password', async () => {
    const { users, sessions, registerUser } = setup()

    const result = await registerUser(validInput)

    expect(result.user.email).toBe('alex@example.com')
    expect(result.user.passwordHash).toBe('hashed:S3nha!forte')
    expect(result.sessionToken).toBe('token-1')
    expect(result.sessionExpiresAt.getTime()).toBeGreaterThan(Date.now())
    expect(users.users).toHaveLength(1)
    expect(sessions.sessions).toHaveLength(1)
    expect(sessions.sessions[0]?.tokenHash).toBe('hash(token-1)')
  })

  it('rejects an email that is already registered', async () => {
    const { registerUser } = setup()
    await registerUser(validInput)
    await expect(registerUser(validInput)).rejects.toBeInstanceOf(ConflictError)
  })

  it('rejects a weak password with field-level details', async () => {
    const { registerUser } = setup()
    const attempt = registerUser({ ...validInput, password: 'fraca' })
    await expect(attempt).rejects.toBeInstanceOf(ValidationError)
    await attempt.catch((error: ValidationError) => {
      expect(error.fields.password).toBeDefined()
    })
  })

  it('rejects an invalid first name', async () => {
    const { registerUser } = setup()
    await expect(
      registerUser({ ...validInput, firstName: 'Alex Doe' }),
    ).rejects.toBeInstanceOf(ValidationError)
  })
})
