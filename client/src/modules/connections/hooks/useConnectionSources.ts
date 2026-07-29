import { connectionSources } from '../sources'

import type { ConnectionSource } from '../types'


export function useConnectionSources(): ConnectionSource[] {
  return connectionSources
}
