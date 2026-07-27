import { AppError } from '../../../domain/index.js'

import type { RequestHandler } from 'express'

import type { CompleteProviderConnection, Provider } from '../../../domain/index.js'
import type { Logger } from '../../logging/index.js'


export type OAuthCallbackDeps = {
  completeProviderConnection: CompleteProviderConnection
  clientUrl: string
  logger: Logger
}

export const createOAuthCallbackController = (
  provider: Provider,
  deps: OAuthCallbackDeps,
): RequestHandler => {
  return async (req, res) => {
    const code = typeof req.query.code === 'string' ? req.query.code : null
    const state = typeof req.query.state === 'string' ? req.query.state : null
    const redirect = new URL('/connect', deps.clientUrl)

    if (!code || !state) {
      redirect.searchParams.set('error', 'VALIDATION')
      res.redirect(redirect.toString())
      return
    }

    try {
      await deps.completeProviderConnection({
        userId: req.currentUser?.id ?? null,
        provider,
        state,
        code,
      })
      redirect.searchParams.set('connected', provider)
    } catch (error) {
      if (error instanceof AppError) {
        redirect.searchParams.set('error', error.code)
      } else {
        deps.logger.error({ err: error }, 'unexpected oauth callback error')
        redirect.searchParams.set('error', 'INTERNAL')
      }
    }

    res.redirect(redirect.toString())
  }
}
