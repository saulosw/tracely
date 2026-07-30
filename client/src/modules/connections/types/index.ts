import type { SourceId } from '@/shared/components/SourceGlyph'


export type Provider = 'GITHUB'

export type ConnectionStatus = 'ACTIVE' | 'REVOKED' | 'ERROR'

export type ProviderConnection = {
  id: string
  provider: Provider
  accountLogin: string
  accountName: string | null
  avatarUrl: string | null
  status: ConnectionStatus
  lastSyncedAt: string | null
  createdAt: string
}

export type ConnectionState = 'connected' | 'disconnected' | 'unavailable'

export type SourceCatalogEntry = {
  id: SourceId
  name: string
  description: string
  provider?: Provider
  detail?: string
}

export type ConnectionSource = SourceCatalogEntry & {
  state: ConnectionState
  connection: ProviderConnection | null
}

export type UpcomingSource = {
  id: SourceId
  name: string
}
