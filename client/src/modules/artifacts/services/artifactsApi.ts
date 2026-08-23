import { graphqlRequest } from '@/shared/lib/graphql'
import { artifactPeriods } from '../schemas/journalSchema'
import { artifactKinds } from '../types'

import type { ConnectionSource } from '@/modules/connections'
import type { ArtifactPeriod } from '../schemas/journalSchema'
import type { Artifact, ArtifactKind, ArtifactSummary } from '../types'


const JOURNAL_FIELDS = `
  id
  kind
  period
  from
  to
  timezone
  providers
  activityCount
  generatedAt
  versions { id generatedAt }
  journal {
    granularity
    activityCount
    truncated
    sections {
      from
      to
      overflow
      entries {
        id
        provider
        type
        variant
        reference
        title
        project
        count
        url
        at
        measures { key value partial }
        items { id title url at }
      }
    }
  }
`

const SUMMARY_FIELDS = `
  id
  kind
  from
  to
  timezone
  activityCount
  generatedAt
`

const GENERATE_JOURNAL = `
  mutation GenerateJournal($input: GenerateJournalInput!) {
    generateJournal(input: $input) { ${JOURNAL_FIELDS} }
  }
`

const REGENERATE_JOURNAL = `
  mutation RegenerateJournal($id: ID!) {
    regenerateArtifact(id: $id) { ${JOURNAL_FIELDS} }
  }
`

const READ_JOURNAL = `
  query JournalArtifact($id: ID!) {
    artifact(id: $id) { ${JOURNAL_FIELDS} }
  }
`

const READ_LIBRARY = `
  query ArtifactLibrary($after: String) {
    artifacts(after: $after) {
      items { ${SUMMARY_FIELDS} }
      nextCursor
    }
  }
`

const toEnumValue = (value: string): string => value.replace(/-/g, '_').toUpperCase()

const PERIOD_BY_ENUM = new Map<string, ArtifactPeriod>(
  artifactPeriods.map((period) => [toEnumValue(period), period]),
)

const KIND_BY_ENUM = new Map<string, ArtifactKind>(
  artifactKinds.map((kind) => [toEnumValue(kind), kind]),
)

export type GenerateJournalInput = {
  period: ArtifactPeriod
  timezone: string
  from?: string
  to?: string
  providers: string[]
}

export type ArtifactSummaryPage = {
  items: ArtifactSummary[]
  nextCursor: string | null
}

type WireArtifact = Omit<Artifact, 'kind' | 'period'> & { kind: string; period: string }

type WireSummary = Omit<ArtifactSummary, 'kind'> & { kind: string }

const toArtifact = (artifact: WireArtifact): Artifact => ({
  ...artifact,
  kind: KIND_BY_ENUM.get(artifact.kind) ?? null,
  period: PERIOD_BY_ENUM.get(artifact.period) ?? null,
})

const toSummary = (summary: WireSummary): ArtifactSummary => ({
  ...summary,
  kind: KIND_BY_ENUM.get(summary.kind) ?? null,
})

const selectedSources = (selected: string[], sources: ConnectionSource[]): ConnectionSource[] =>
  sources.filter((source) => selected.includes(source.id) && source.state === 'connected')

export const providersOf = (selected: string[], sources: ConnectionSource[]): string[] =>
  selectedSources(selected, sources).flatMap((source) => (source.provider ? [source.provider] : []))

export const connectionIdsOf = (selected: string[], sources: ConnectionSource[]): string[] =>
  selectedSources(selected, sources).flatMap((source) =>
    source.connection ? [source.connection.id] : [],
  )

export async function generateJournal(input: GenerateJournalInput): Promise<Artifact> {
  const data = await graphqlRequest<{ generateJournal: WireArtifact }>(GENERATE_JOURNAL, {
    input: { ...input, period: toEnumValue(input.period) },
  })
  return toArtifact(data.generateJournal)
}

export async function regenerateJournal(id: string): Promise<Artifact> {
  const data = await graphqlRequest<{ regenerateArtifact: WireArtifact }>(REGENERATE_JOURNAL, {
    id,
  })
  return toArtifact(data.regenerateArtifact)
}

export async function fetchArtifact(id: string): Promise<Artifact> {
  const data = await graphqlRequest<{ artifact: WireArtifact }>(READ_JOURNAL, { id })
  return toArtifact(data.artifact)
}

export async function fetchArtifacts(after?: string): Promise<ArtifactSummaryPage> {
  const data = await graphqlRequest<{ artifacts: { items: WireSummary[]; nextCursor: string | null } }>(
    READ_LIBRARY,
    { after: after ?? null },
  )
  return { items: data.artifacts.items.map(toSummary), nextCursor: data.artifacts.nextCursor }
}
