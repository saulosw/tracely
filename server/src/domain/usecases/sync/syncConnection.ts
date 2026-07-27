import { emptySyncStats } from '../../entities/index.js'
import {
  AuthorizationError,
  NotFoundError,
  ProviderAuthError,
  safeErrorMessage,
} from '../../errors/index.js'

import type { Connection, Project, SyncRun, SyncRunStatus } from '../../entities/index.js'
import type { ActivityProvider, ProviderRegistry } from '../../providers/index.js'
import type {
  ActivityRepository,
  ConnectionRepository,
  ProjectRepository,
  SyncRunRepository,
} from '../../repositories/index.js'
import type { TokenCipher } from '../../security/index.js'


export type SyncConnectionInput = {
  userId: string
  connectionId: string
}

export type SyncTrigger = {
  run: SyncRun
  completion: Promise<void> | null
}

export type SyncConnection = (input: SyncConnectionInput) => Promise<SyncTrigger>

type SyncDeps = {
  connectionRepository: ConnectionRepository
  projectRepository: ProjectRepository
  activityRepository: ActivityRepository
  syncRunRepository: SyncRunRepository
  activityProviders: ProviderRegistry<ActivityProvider>
  tokenCipher: TokenCipher
}

const shouldSkipProject = (project: Project): boolean => {
  if (project.isArchived) {
    return true
  }
  return Boolean(
    project.lastSyncedAt &&
      project.providerPushedAt &&
      project.providerPushedAt.getTime() <= project.lastSyncedAt.getTime(),
  )
}

const executeSync = async (deps: SyncDeps, connection: Connection, run: SyncRun) => {
  const stats = emptySyncStats()
  let status: SyncRunStatus = 'succeeded'
  let errorMessage: string | null = null

  try {
    const provider = deps.activityProviders.get(connection.provider)
    const accessToken = deps.tokenCipher.decrypt(connection.encryptedAccessToken)
    const account = await provider.fetchAccount(accessToken)

    const projects: Project[] = []
    for await (const batch of provider.fetchProjects(accessToken)) {
      const upserted = await deps.projectRepository.upsertMany(
        batch.map((project) => ({ ...project, connectionId: connection.id })),
      )
      projects.push(...upserted)
    }

    for (const project of projects) {
      if (shouldSkipProject(project)) {
        continue
      }
      try {
        const activityIterator = provider.fetchProjectActivities({
          accessToken,
          project,
          account,
          since: project.lastSyncedAt,
        })
        for await (const batch of activityIterator) {
          await deps.activityRepository.upsertMany(
            batch.map((activity) => ({
              ...activity,
              connectionId: connection.id,
              projectId: project.id,
            })),
          )
          for (const activity of batch) {
            stats.activities[activity.type] = (stats.activities[activity.type] ?? 0) + 1
          }
        }
        await deps.projectRepository.markSynced(project.id, run.startedAt)
        stats.projects += 1
      } catch (error) {
        if (error instanceof ProviderAuthError) {
          throw error
        }
        stats.projectErrors.push({ project: project.fullName, message: safeErrorMessage(error) })
      }
    }

    await deps.connectionRepository.updateAfterSync(
      connection.id,
      connection.syncCursor,
      run.startedAt,
    )
    if (stats.projectErrors.length > 0) {
      status = 'partial'
    }
  } catch (error) {
    status = 'failed'
    errorMessage = safeErrorMessage(error)
    if (error instanceof ProviderAuthError) {
      await deps.connectionRepository.updateStatus(connection.id, 'error')
    }
  }

  await deps.syncRunRepository.finish(run.id, {
    status,
    finishedAt: new Date(),
    stats,
    error: errorMessage,
  })
}

export const makeSyncConnection = (deps: SyncDeps): SyncConnection => {
  return async ({ userId, connectionId }) => {
    const connection = await deps.connectionRepository.findById(connectionId)
    if (!connection) {
      throw new NotFoundError('Connection not found')
    }
    if (connection.userId !== userId) {
      throw new AuthorizationError('Connection belongs to another user')
    }

    const running = await deps.syncRunRepository.findRunning(connectionId)
    if (running) {
      return { run: running, completion: null }
    }

    const run = await deps.syncRunRepository.create(connectionId, new Date())
    return { run, completion: executeSync(deps, connection, run) }
  }
}
