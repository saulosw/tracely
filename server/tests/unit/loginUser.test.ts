import { describe, expect, it } from 'vitest'

import {
  AuthenticationError,
  makeGetSessionUser,
  makeLoginUser,
  makeLogoutUser,
  makeRegisterUser,
} from '../../src/domain/index.js'
import {
  createFakeSessionRepository,
  createFakeTokenGenerator,
  createFakeUserRepository,
  fakePasswordHasher,
} from '../fakes/fakes.js'


const setup = () => {
  const users = createFakeUserRepository()
  const sessions = createFakeSessionRepository()
  const tokenGenerator = createFakeTokenGenerator()
  const deps = {
    userRepository: users.repository,
    sessionRepository: sessions.repository,
    passwordHasher: fakePasswordHasher,
    tokenGenerator,
  }
  return {
    users,
    sessions,
    registerUser: makeRegisterUser(deps),
    loginUser: makeLoginUser(deps),
    logoutUser: makeLogoutUser(deps),
    getSessionUser: makeGetSessionUser(deps),
  }
}

describe('loginUser', () => {
  it('issues a new session for valid credentials', async () => {
    const { registerUser, loginUser, sessions } = setup()
    await registerUser({ firstName: 'Saulo', email: 'saulo@example.com', password: 'S3nha!forte' })

    const result = await loginUser({ email: 'SAULO@example.com', password: 'S3nha!forte' })

    expect(result.user.email).toBe('saulo@example.com')
    expect(result.sessionToken).toBe('token-2')
    expect(sessions.sessions).toHaveLength(2)
  })

  it('rejects a wrong password', async () => {
    const { registerUser, loginUser } = setup()
    await registerUser({ firstName: 'Saulo', email: 'saulo@example.com', password: 'S3nha!forte' })
    await expect(
      loginUser({ email: 'saulo@example.com', password: 'S3nha!errada' }),
    ).rejects.toBeInstanceOf(AuthenticationError)
  })

  it('rejects an unknown email with the same error', async () => {
    const { loginUser } = setup()
    await expect(
      loginUser({ email: 'ghost@example.com', password: 'S3nha!forte' }),
    ).rejects.toBeInstanceOf(AuthenticationError)
  })
})

describe('session lifecycle', () => {
  it('resolves the user from an active session and forgets it after logout', async () => {
    const { registerUser, logoutUser, getSessionUser } = setup()
    const { user, sessionToken } = await registerUser({
      firstName: 'Saulo',
      email: 'saulo@example.com',
      password: 'S3nha!forte',
    })

    await expect(getSessionUser(sessionToken)).resolves.toMatchObject({ id: user.id })

    await logoutUser(sessionToken)
    await expect(getSessionUser(sessionToken)).resolves.toBeNull()
  })

  it('ignores expired sessions', async () => {
    const { registerUser, getSessionUser, sessions } = setup()
    const { sessionToken } = await registerUser({
      firstName: 'Saulo',
      email: 'saulo@example.com',
      password: 'S3nha!forte',
    })
    sessions.sessions[0]!.expiresAt = new Date(Date.now() - 1000)
    await expect(getSessionUser(sessionToken)).resolves.toBeNull()
  })
})
