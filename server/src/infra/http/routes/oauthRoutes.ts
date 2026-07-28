import { Router } from 'express'

import { createOAuthCallbackController } from '../controllers/oauthCallbackController.js'

import type { OAuthCallbackDeps } from '../controllers/oauthCallbackController.js'


export const createOAuthRouter = (deps: OAuthCallbackDeps): Router => {
  const router = Router()
  router.get('/oauth/github/callback', createOAuthCallbackController('github', deps))
  return router
}
