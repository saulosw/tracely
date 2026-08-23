import type { ArtifactPeriod } from '../schemas/journalSchema'


export const artifactKinds = ['journal'] as const

export type ArtifactKind = (typeof artifactKinds)[number]

export type Provider = 'GITHUB'

export type ActivityType = 'COMMIT' | 'PULL_REQUEST' | 'ISSUE' | 'RELEASE'

export type JournalGranularity = 'TIME' | 'DAY'

export type Measure = {
  key: string
  value: number
  partial: boolean
}

export type JournalItem = {
  id: string
  title: string
  url: string | null
  at: string
}

export type JournalEntry = {
  id: string
  provider: Provider
  type: ActivityType
  variant: string | null
  reference: string | null
  title: string
  project: string | null
  count: number
  measures: Measure[]
  items: JournalItem[]
  url: string | null
  at: string | null
}

export type JournalSection = {
  from: string
  to: string
  overflow: number
  entries: JournalEntry[]
}

export type JournalPayload = {
  granularity: JournalGranularity
  activityCount: number
  truncated: boolean
  sections: JournalSection[]
}

export type ArtifactVersion = {
  id: string
  generatedAt: string
}

export type Artifact = {
  id: string
  kind: ArtifactKind | null
  period: ArtifactPeriod | null
  from: string
  to: string
  timezone: string
  providers: Provider[]
  activityCount: number
  journal: JournalPayload | null
  versions: ArtifactVersion[]
  generatedAt: string
}

export type ArtifactSummary = {
  id: string
  kind: ArtifactKind | null
  from: string
  to: string
  timezone: string
  activityCount: number
  generatedAt: string
}
