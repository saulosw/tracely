import { useConnections } from './useConnections'

import type { ConnectionSource } from '../types'


export function useConnectionSources(): ConnectionSource[] {
  return useConnections().sources
}
