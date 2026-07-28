import type {
  Connection,
  ConnectionStatus,
  NewConnection,
  SyncCursor,
} from '../entities/index.js'


export type ConnectionRepository = {
  upsert(connection: NewConnection): Promise<Connection>
  findById(id: string): Promise<Connection | null>
  listByUser(userId: string): Promise<Connection[]>
  updateStatus(id: string, status: ConnectionStatus): Promise<void>
  updateAfterSync(id: string, syncCursor: SyncCursor, lastSyncedAt: Date): Promise<void>
  delete(id: string): Promise<void>
}
