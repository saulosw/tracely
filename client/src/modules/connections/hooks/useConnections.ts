import { createContext, useContext } from 'react'

import type { ConnectionSource, Provider } from '../types'


export type ConnectionsStatus = 'loading' | 'ready'

export type ConnectionsContextValue = {
  sources: ConnectionSource[]
  status: ConnectionsStatus
  connect: (provider: Provider) => Promise<void>
  disconnect: (connectionId: string) => Promise<void>
}

export const ConnectionsContext = createContext<ConnectionsContextValue | null>(null)

export function useConnections(): ConnectionsContextValue {
  const context = useContext(ConnectionsContext)
  if (!context) {
    throw new Error('useConnections precisa estar dentro de um ConnectionsProvider')
  }
  return context
}
