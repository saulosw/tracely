import type { Connection } from '../../entities/index.js'
import type { ConnectionRepository } from '../../repositories/index.js'


export type ListConnections = (userId: string) => Promise<Connection[]>

export const makeListConnections = (deps: {
  connectionRepository: ConnectionRepository
}): ListConnections => {
  return async (userId) => deps.connectionRepository.listByUser(userId)
}
