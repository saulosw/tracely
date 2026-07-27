import { SESSION_COOKIE_NAME } from '../sessionCookie.js'

import type { RequestHandler } from 'express'

import type { GetSessionUser } from '../../../domain/index.js'


export const createSessionMiddleware = (getSessionUser: GetSessionUser): RequestHandler => {
  return async (req, _res, next) => {
    const cookies = (req.cookies ?? {}) as Record<string, string | undefined>
    const token = cookies[SESSION_COOKIE_NAME] ?? null
    req.sessionToken = token
    req.currentUser = token ? await getSessionUser(token) : null
    next()
  }
}
