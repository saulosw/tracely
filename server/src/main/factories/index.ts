import {
  createProviderRegistry,
  makeCompleteProviderConnection,
  makeDisconnectProvider,
  makeGetSessionUser,
  makeGetSyncStatus,
  makeListActivities,
  makeListConnections,
  makeLoginUser,
  makeLogoutUser,
  makeRegisterUser,
  makeStartProviderConnection,
  makeSyncConnection,
} from '../../domain/index.js'
import { createDatabase } from '../../infra/database/index.js'
import { createYogaServer } from '../../infra/graphql/index.js'
import { createOAuthRouter, createSessionMiddleware } from '../../infra/http/index.js'
import { createLogger } from '../../infra/logging/index.js'
import {
  createGithubActivityProvider,
  createGithubOAuthClient,
} from '../../infra/providers/index.js'
import {
  createDrizzleActivityRepository,
  createDrizzleConnectionRepository,
  createDrizzleOAuthStateRepository,
  createDrizzleProjectRepository,
  createDrizzleSessionRepository,
  createDrizzleSyncRunRepository,
  createDrizzleUserRepository,
} from '../../infra/repositories/index.js'
import {
  createAesGcmTokenCipher,
  createCryptoTokenGenerator,
  createScryptPasswordHasher,
} from '../../infra/security/index.js'

import type { UseCases } from '../../domain/index.js'
import type { Config } from '../config/index.js'


export const composeServer = (config: Config) => {
  const logger = createLogger(config.logLevel, config.nodeEnv === 'development')
  const db = createDatabase(config.databaseUrl)

  const userRepository = createDrizzleUserRepository(db)
  const sessionRepository = createDrizzleSessionRepository(db)
  const oauthStateRepository = createDrizzleOAuthStateRepository(db)
  const connectionRepository = createDrizzleConnectionRepository(db)
  const projectRepository = createDrizzleProjectRepository(db)
  const activityRepository = createDrizzleActivityRepository(db)
  const syncRunRepository = createDrizzleSyncRunRepository(db)

  const passwordHasher = createScryptPasswordHasher()
  const tokenGenerator = createCryptoTokenGenerator()
  const tokenCipher = createAesGcmTokenCipher(config.tokenEncryptionKey)

  const oauthClients = createProviderRegistry({
    github: createGithubOAuthClient(config.github, logger),
  })
  const activityProviders = createProviderRegistry({
    github: createGithubActivityProvider(),
  })

  const useCases: UseCases = {
    registerUser: makeRegisterUser({
      userRepository,
      sessionRepository,
      passwordHasher,
      tokenGenerator,
    }),
    loginUser: makeLoginUser({
      userRepository,
      sessionRepository,
      passwordHasher,
      tokenGenerator,
    }),
    logoutUser: makeLogoutUser({ sessionRepository, tokenGenerator }),
    getSessionUser: makeGetSessionUser({ sessionRepository, userRepository, tokenGenerator }),
    startProviderConnection: makeStartProviderConnection({
      oauthStateRepository,
      oauthClients,
      tokenGenerator,
    }),
    completeProviderConnection: makeCompleteProviderConnection({
      oauthStateRepository,
      connectionRepository,
      oauthClients,
      tokenCipher,
    }),
    disconnectProvider: makeDisconnectProvider({
      connectionRepository,
      oauthClients,
      tokenCipher,
    }),
    listConnections: makeListConnections({ connectionRepository }),
    syncConnection: makeSyncConnection({
      connectionRepository,
      projectRepository,
      activityRepository,
      syncRunRepository,
      activityProviders,
      tokenCipher,
    }),
    getSyncStatus: makeGetSyncStatus({ connectionRepository, syncRunRepository }),
    listActivities: makeListActivities({ activityRepository }),
  }

  const sessionMiddleware = createSessionMiddleware(useCases.getSessionUser)
  const oauthRouter = createOAuthRouter({
    completeProviderConnection: useCases.completeProviderConnection,
    clientUrl: config.clientUrl,
    logger,
  })
  const yoga = createYogaServer({
    useCases,
    logger,
    clientUrl: config.clientUrl,
    secureCookies: config.nodeEnv === 'production',
    graphiql: config.nodeEnv !== 'production',
  })

  const sweepStaleSyncRuns = () => syncRunRepository.failStaleRunning(new Date())

  return { logger, sessionMiddleware, oauthRouter, yoga, sweepStaleSyncRuns }
}

export type ServerDeps = ReturnType<typeof composeServer>
