import { describe, expect, it, vi } from 'vitest'

import { AuthenticationError, emptySyncStats } from '../../src/domain/index.js'
import { createOAuthCallbackController } from '../../src/infra/http/controllers/oauthCallbackController.js'

import type { Request, Response } from 'express'
import type { Connection, SyncRun } from '../../src/domain/index.js'
import type { OAuthCallbackDeps } from '../../src/infra/http/controllers/oauthCallbackController.js'


const connection: Connection = {
  id: 'conn-1',
  userId: 'user-1',
  provider: 'github',
  externalAccountId: '42',
  accountLogin: 'octocat',
  accountName: 'Alex',
  avatarUrl: null,
  encryptedAccessToken: 'enc:gh-token',
  scopes: ['repo'],
  status: 'active',
  syncCursor: {},
  lastSyncedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const run: SyncRun = {
  id: 'run-1',
  connectionId: 'conn-1',
  status: 'running',
  startedAt: new Date(),
  finishedAt: null,
  stats: emptySyncStats(),
  error: null,
}

const setup = (overrides: Partial<OAuthCallbackDeps> = {}) => {
  const deps: OAuthCallbackDeps = {
    completeProviderConnection: vi.fn().mockResolvedValue(connection),
    syncConnection: vi.fn().mockResolvedValue({ run, completion: Promise.resolve() }),
    clientUrl: 'http://localhost:5173',
    logger: { error: vi.fn() } as unknown as OAuthCallbackDeps['logger'],
    ...overrides,
  }
  return { deps, controller: createOAuthCallbackController('github', deps) }
}

const call = async (
  controller: ReturnType<typeof createOAuthCallbackController>,
  query: Record<string, string>,
) => {
  const redirect = vi.fn()
  await controller(
    { query, currentUser: { id: 'user-1' } } as unknown as Request,
    { redirect } as unknown as Response,
    vi.fn(),
  )
  return String(redirect.mock.calls[0]?.[0])
}

describe('oauthCallbackController', () => {
  it('completes the connection, starts its first sync and redirects as connected', async () => {
    const { deps, controller } = setup()

    const location = await call(controller, { code: 'oauth-code', state: 'state-1' })

    expect(location).toBe('http://localhost:5173/connect?connected=github')
    expect(deps.syncConnection).toHaveBeenCalledWith({ userId: 'user-1', connectionId: 'conn-1' })
  })

  it('does not start a sync when the connection could not be completed', async () => {
    const { deps, controller } = setup({
      completeProviderConnection: vi.fn().mockRejectedValue(new AuthenticationError('bad state')),
    })

    const location = await call(controller, { code: 'oauth-code', state: 'state-1' })

    expect(location).toContain('error=UNAUTHENTICATED')
    expect(deps.syncConnection).not.toHaveBeenCalled()
  })

  it('still redirects as connected when the sync trigger fails', async () => {
    const { deps, controller } = setup({
      syncConnection: vi.fn().mockRejectedValue(new Error('provider down')),
    })

    const location = await call(controller, { code: 'oauth-code', state: 'state-1' })

    expect(location).toBe('http://localhost:5173/connect?connected=github')
    await vi.waitFor(() => expect(deps.logger.error).toHaveBeenCalled())
  })
})
