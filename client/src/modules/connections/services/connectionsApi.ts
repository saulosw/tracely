import { graphqlRequest } from '@/shared/lib/graphql'

import type { Provider, ProviderConnection } from '../types'


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
