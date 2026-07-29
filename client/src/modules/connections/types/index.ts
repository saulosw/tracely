import type { SourceId } from '@/shared/components/SourceGlyph'


export type ConnectionState = 'connected' | 'disconnected' | 'unavailable'

export type ConnectionSource = {
  id: SourceId
  name: string
  description: string
  state: ConnectionState
  detail?: string
}

export type UpcomingSource = {
  id: SourceId
  name: string
}
