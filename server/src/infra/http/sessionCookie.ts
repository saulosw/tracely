import type { CookieOptions, Response } from 'express'


export const SESSION_COOKIE_NAME = 'tracely_session'

const baseOptions = (secure: boolean): CookieOptions => ({
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  secure,
})

export const setSessionCookie = (
  res: Response,
  token: string,
  expiresAt: Date,
  secure: boolean,
) => {
  res.cookie(SESSION_COOKIE_NAME, token, { ...baseOptions(secure), expires: expiresAt })
}

export const clearSessionCookie = (res: Response, secure: boolean) => {
  res.clearCookie(SESSION_COOKIE_NAME, baseOptions(secure))
}
