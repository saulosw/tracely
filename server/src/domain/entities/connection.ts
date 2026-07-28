import type { Provider } from './provider.js'


export type ConnectionStatus = 'active' | 'revoked' | 'error'

export type SyncCursor = Record<string, string>

export type Connection = {
  id: string
  userId: string
  provider: Provider
  externalAccountId: string
  accountLogin: string
  accountName: string | null
  avatarUrl: string | null
  encryptedAccessToken: string
  scopes: string[]
  status: ConnectionStatus
  syncCursor: SyncCursor
  lastSyncedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type NewConnection = Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>
