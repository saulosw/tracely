import { z } from 'zod'

import type { Provider } from './provider.js'


export const ACTIVITY_TYPES = ['commit', 'pull_request', 'issue', 'release'] as const

export type ActivityType = (typeof ACTIVITY_TYPES)[number]

const fileChangeSchema = z.object({
  path: z.string(),
  status: z.string(),
  additions: z.number().int().nonnegative(),
  deletions: z.number().int().nonnegative(),
})

export const commitDetailsSchema = z.object({
  kind: z.literal('commit'),
  sha: z.string(),
  message: z.string(),
  authorName: z.string().nullable(),
  authorEmail: z.string().nullable(),
  branch: z.string().nullable(),
  additions: z.number().int().nullable(),
  deletions: z.number().int().nullable(),
  filesChanged: z.number().int().nullable(),
  files: z.array(fileChangeSchema).nullable(),
  filesTruncated: z.boolean(),
})

export const pullRequestDetailsSchema = z.object({
  kind: z.literal('pull_request'),
  number: z.number().int(),
  state: z.enum(['open', 'closed']),
  isDraft: z.boolean(),
  merged: z.boolean(),
  mergedAt: z.string().nullable(),
  baseBranch: z.string(),
  headBranch: z.string(),
  additions: z.number().int().nullable(),
  deletions: z.number().int().nullable(),
  changedFiles: z.number().int().nullable(),
  commits: z.number().int().nullable(),
  labels: z.array(z.string()),
  comments: z.number().int(),
})

export const issueDetailsSchema = z.object({
  kind: z.literal('issue'),
  number: z.number().int(),
  state: z.enum(['open', 'closed']),
  closedAt: z.string().nullable(),
  labels: z.array(z.string()),
  comments: z.number().int(),
})

export const releaseDetailsSchema = z.object({
  kind: z.literal('release'),
  tagName: z.string(),
  name: z.string().nullable(),
  isPrerelease: z.boolean(),
})

export const activityDetailsSchema = z.discriminatedUnion('kind', [
  commitDetailsSchema,
  pullRequestDetailsSchema,
  issueDetailsSchema,
  releaseDetailsSchema,
])

export type FileChange = z.infer<typeof fileChangeSchema>

export type CommitDetails = z.infer<typeof commitDetailsSchema>

export type PullRequestDetails = z.infer<typeof pullRequestDetailsSchema>

export type IssueDetails = z.infer<typeof issueDetailsSchema>

export type ReleaseDetails = z.infer<typeof releaseDetailsSchema>

export type ActivityDetails = z.infer<typeof activityDetailsSchema>

export type Actor = {
  externalId: string | null
  login: string | null
  isConnectedUser: boolean
  isBot: boolean
}

export type Activity = {
  id: string
  connectionId: string
  projectId: string | null
  provider: Provider
  type: ActivityType
  externalId: string
  title: string
  summary: string | null
  url: string | null
  actor: Actor
  occurredAt: Date
  details: ActivityDetails
  recordedAt: Date
}

export type NewActivity = Omit<Activity, 'id' | 'recordedAt'>

export type ActivityWithProject = Activity & {
  projectName: string | null
  projectFullName: string | null
}
