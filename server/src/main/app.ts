import cookieParser from 'cookie-parser'
import express from 'express'

import type { ServerDeps } from './factories/index.js'


export const buildApp = (deps: ServerDeps) => {
  const app = express()

  app.use(cookieParser())
  app.use(deps.sessionMiddleware)

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use(deps.oauthRouter)
  app.use('/graphql', (req, res) => {
    void deps.yoga(req, res)
  })

  return app
}
