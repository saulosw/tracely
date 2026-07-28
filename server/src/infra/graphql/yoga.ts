import { createYoga } from 'graphql-yoga'

import { clearSessionCookie, setSessionCookie } from '../http/sessionCookie.js'
import { createMaskError } from './maskError.js'
import { schema } from './schema/index.js'

import type { Request, Response } from 'express'

import type { UseCases } from '../../domain/index.js'
import type { Logger } from '../logging/index.js'
import type { GraphQLContext } from './context.js'


export type YogaDeps = {
  useCases: UseCases
  logger: Logger
  clientUrl: string
  secureCookies: boolean
  graphiql: boolean
}

export const createYogaServer = (deps: YogaDeps) =>
  createYoga<{ req: Request; res: Response }>({
    schema,
    graphqlEndpoint: '/graphql',
    graphiql: deps.graphiql,
    maskedErrors: { maskError: createMaskError(deps.logger) },
    cors: { origin: deps.clientUrl, credentials: true },
    logging: false,
    context: ({ req, res }): GraphQLContext => ({
      useCases: deps.useCases,
      logger: deps.logger,
      currentUser: req.currentUser ?? null,
      sessionToken: req.sessionToken ?? null,
      setSessionCookie: (token, expiresAt) =>
        setSessionCookie(res, token, expiresAt, deps.secureCookies),
      clearSessionCookie: () => clearSessionCookie(res, deps.secureCookies),
    }),
  })
