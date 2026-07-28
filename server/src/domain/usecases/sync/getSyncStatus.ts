import { AuthorizationError, NotFoundError } from '../../errors/index.js'

import type { SyncRun } from '../../entities/index.js'
import type { ConnectionRepository, SyncRunRepository } from '../../repositories/index.js'


export type GetSyncStatusInput = {
  userId: string
  connectionId: string
}

export type GetSyncStatus = (input: GetSyncStatusInput) => Promise<SyncRun | null>

export const makeGetSyncStatus = (deps: {
  connectionRepository: ConnectionRepository
  syncRunRepository: SyncRunRepository
}): GetSyncStatus => {
  return async ({ userId, connectionId }) => {
    const connection = await deps.connectionRepository.findById(connectionId)
    if (!connection) {
      throw new NotFoundError('Connection not found')
    }
    if (connection.userId !== userId) {
      throw new AuthorizationError('Connection belongs to another user')
    }
    return deps.syncRunRepository.findLatest(connectionId)
  }
}
