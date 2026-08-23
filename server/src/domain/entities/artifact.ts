import { z } from 'zod'

import { ACTIVITY_TYPES } from './activity.js'
import { PROVIDERS } from './provider.js'

import type { Provider } from './provider.js'


export const ARTIFACT_KINDS = ['journal'] as const

export type ArtifactKind = (typeof ARTIFACT_KINDS)[number]

export const ARTIFACT_PERIODS = ['yesterday', 'today', 'week', 'month', 'year', 'custom'] as const

export type ArtifactPeriod = (typeof ARTIFACT_PERIODS)[number]

const measureSchema = z.object({
  key: z.string(),
  value: z.number(),
  partial: z.boolean(),
})

const journalItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().nullable(),
  at: z.string(),
})

const journalEntrySchema = z.object({
  id: z.string(),
  provider: z.enum(PROVIDERS),
  type: z.enum(ACTIVITY_TYPES),
  variant: z.string().nullable(),
  reference: z.string().nullable(),
  title: z.string(),
  project: z.string().nullable(),
  count: z.number().int().positive(),
  measures: z.array(measureSchema),
  items: z.array(journalItemSchema).default([]),
  url: z.string().nullable(),
  at: z.string().nullable(),
})

const journalSectionSchema = z.object({
  from: z.string(),
  to: z.string(),
  overflow: z.number().int().nonnegative(),
  entries: z.array(journalEntrySchema),
})

export const JOURNAL_GRANULARITIES = ['time', 'day'] as const

export type JournalGranularity = (typeof JOURNAL_GRANULARITIES)[number]

export const journalPayloadSchema = z.object({
  kind: z.literal('journal'),
  granularity: z.enum(JOURNAL_GRANULARITIES),
  activityCount: z.number().int().nonnegative(),
  truncated: z.boolean(),
  sections: z.array(journalSectionSchema),
})

export const artifactPayloadSchema = z.discriminatedUnion('kind', [journalPayloadSchema])

export type Measure = z.infer<typeof measureSchema>

export type JournalItem = z.infer<typeof journalItemSchema>

export type JournalEntry = z.infer<typeof journalEntrySchema>

export type JournalSection = z.infer<typeof journalSectionSchema>

export type JournalPayload = z.infer<typeof journalPayloadSchema>

export type ArtifactPayload = z.infer<typeof artifactPayloadSchema>

export type Artifact = {
  id: string
  userId: string
  rootId: string
  kind: ArtifactKind
  period: ArtifactPeriod
  from: Date
  to: Date
  timezone: string
  providers: Provider[]
  payload: ArtifactPayload
  generatedAt: Date
}

export type NewArtifact = Omit<Artifact, 'id' | 'rootId' | 'generatedAt'> & {
  rootId: string | null
}

export type ArtifactVersion = {
  id: string
  generatedAt: Date
}
