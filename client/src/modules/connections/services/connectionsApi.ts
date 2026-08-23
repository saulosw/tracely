import { graphqlRequest } from '@/shared/lib/graphql'

import type { Provider, ProviderConnection, SyncRunStatus } from '../types'


const CONNECTION_FIELDS = `
  id
  provider
  accountLogin
  accountName
  avatarUrl
  status
  lastSyncedAt
  createdAt
`

const CONNECTIONS_QUERY = `
  query Connections {
    connections { ${CONNECTION_FIELDS} }
  }
`

const CONNECT_PROVIDER_MUTATION = `
  mutation ConnectProvider($provider: Provider!) {
    connectProvider(provider: $provider) {
      authorizeUrl
    }
  }
`

const DISCONNECT_PROVIDER_MUTATION = `
  mutation DisconnectProvider($connectionId: ID!) {
    disconnectProvider(connectionId: $connectionId)
  }
`

const TRIGGER_SYNC_MUTATION = `
  mutation TriggerSync($connectionId: ID!) {
    triggerSync(connectionId: $connectionId) { status }
  }
`

const SYNC_STATUS_QUERY = `
  query SyncStatus($connectionId: ID!) {
    syncStatus(connectionId: $connectionId) { status }
  }
`

const SYNC_POLL_INTERVAL_MS = 1500
const SYNC_POLL_LIMIT = 40


export const fetchConnections = async (): Promise<ProviderConnection[]> => {
  const data = await graphqlRequest<{ connections: ProviderConnection[] }>(CONNECTIONS_QUERY)
  return data.connections
}

export const startProviderConnection = async (provider: Provider): Promise<string> => {
  const data = await graphqlRequest<
    { connectProvider: { authorizeUrl: string } },
    { provider: Provider }
  >(CONNECT_PROVIDER_MUTATION, { provider })
  return data.connectProvider.authorizeUrl
}

export const disconnectProvider = async (connectionId: string): Promise<void> => {
  await graphqlRequest<{ disconnectProvider: boolean }, { connectionId: string }>(
    DISCONNECT_PROVIDER_MUTATION,
    { connectionId },
  )
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const triggerSync = async (connectionId: string): Promise<SyncRunStatus> => {
  const data = await graphqlRequest<
    { triggerSync: { status: SyncRunStatus } },
    { connectionId: string }
  >(TRIGGER_SYNC_MUTATION, { connectionId })
  return data.triggerSync.status
}

const fetchSyncStatus = async (connectionId: string): Promise<SyncRunStatus | null> => {
  const data = await graphqlRequest<
    { syncStatus: { status: SyncRunStatus } | null },
    { connectionId: string }
  >(SYNC_STATUS_QUERY, { connectionId })
  return data.syncStatus?.status ?? null
}

const awaitSyncEnd = async (connectionId: string): Promise<void> => {
  for (let attempt = 0; attempt < SYNC_POLL_LIMIT; attempt += 1) {
    await wait(SYNC_POLL_INTERVAL_MS)
    const status = await fetchSyncStatus(connectionId).catch(() => null)
    if (status !== 'RUNNING') {
      return
    }
  }
}

export const syncConnections = async (connectionIds: string[]): Promise<void> => {
  await Promise.all(
    connectionIds.map(async (connectionId) => {
      const status = await triggerSync(connectionId).catch(() => null)
      if (status === 'RUNNING') {
        await awaitSyncEnd(connectionId)
      }
    }),
  )
}
