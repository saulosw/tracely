import { useCallback, useEffect, useMemo, useState } from 'react'

import { useAuth } from '@/modules/auth'
import { ConnectionsContext } from '../../hooks/useConnections'
import * as connectionsApi from '../../services/connectionsApi'
import { sourceCatalog } from '../../sources'

import type { ReactNode } from 'react'
import type { ConnectionsStatus } from '../../hooks/useConnections'
import type { ConnectionSource, Provider, ProviderConnection } from '../../types'


const toSources = (connections: ProviderConnection[]): ConnectionSource[] =>
  sourceCatalog.map((entry) => {
    const connection = entry.provider
      ? (connections.find((current) => current.provider === entry.provider) ?? null)
      : null

    return {
      ...entry,
      connection,
      state: !entry.provider ? 'unavailable' : connection ? 'connected' : 'disconnected',
    }
  })

type ConnectionsProviderProps = {
  children: ReactNode
}

export function ConnectionsProvider({ children }: ConnectionsProviderProps) {
  const { isAuthenticated } = useAuth()
  const [connections, setConnections] = useState<ProviderConnection[]>([])
  const [status, setStatus] = useState<ConnectionsStatus>('loading')

  useEffect(() => {
    if (!isAuthenticated) {
      setConnections([])
      setStatus('ready')
      return
    }

    let active = true

    const resolve = (current: ProviderConnection[]) => {
      if (!active) {
        return
      }
      setConnections(current)
      setStatus('ready')
    }

    setStatus('loading')
    connectionsApi
      .fetchConnections()
      .then(resolve)
      .catch(() => resolve([]))

    return () => {
      active = false
    }
  }, [isAuthenticated])

  const connect = useCallback(async (provider: Provider) => {
    const authorizeUrl = await connectionsApi.startProviderConnection(provider)
    window.location.assign(authorizeUrl)
  }, [])

  const disconnect = useCallback(async (connectionId: string) => {
    await connectionsApi.disconnectProvider(connectionId)
    setConnections((current) => current.filter((connection) => connection.id !== connectionId))
  }, [])

  const value = useMemo(
    () => ({ sources: toSources(connections), status, connect, disconnect }),
    [connections, status, connect, disconnect],
  )

  return <ConnectionsContext.Provider value={value}>{children}</ConnectionsContext.Provider>
}
