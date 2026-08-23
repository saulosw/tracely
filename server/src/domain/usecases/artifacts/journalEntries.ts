import { zonedDayKey, zonedStampOf } from './zonedTime.js'

import type {
  ActivityWithProject,
  JournalEntry,
  JournalItem,
  Measure,
  Provider,
} from '../../entities/index.js'


export type CommitBucket = 'hour' | 'day' | 'span'

const MAX_ITEMS_PER_ENTRY = 25

type CommitGroup = {
  key: string
  provider: Provider
  project: string | null
  activities: ActivityWithProject[]
}

type Measured = { value: number; answered: number }

const measuredSum = (values: (number | null)[]): Measured => {
  const answered = values.filter((value): value is number => value !== null)
  return { value: answered.reduce((total, value) => total + value, 0), answered: answered.length }
}

const measuresOf = (entries: [string, Measured][], sample: number): Measure[] =>
  entries
    .filter(([, measured]) => measured.answered > 0 && measured.value > 0)
    .map(([key, measured]) => ({
      key,
      value: measured.value,
      partial: measured.answered < sample,
    }))

const commitBucketKey = (
  activity: ActivityWithProject,
  timezone: string,
  bucket: CommitBucket,
): string => {
  if (bucket === 'span') {
    return 'span'
  }
  const stamp = zonedStampOf(activity.occurredAt, timezone)
  return bucket === 'hour' ? `${zonedDayKey(stamp)}T${stamp.hour}` : zonedDayKey(stamp)
}

const toItems = (activities: ActivityWithProject[]): JournalItem[] =>
  activities
    .slice()
    .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
    .slice(0, MAX_ITEMS_PER_ENTRY)
    .map((activity) => ({
      id: activity.id,
      title: activity.title,
      url: activity.url,
      at: activity.occurredAt.toISOString(),
    }))

const toCommitEntry = (group: CommitGroup): JournalEntry => {
  const [first] = group.activities
  const single = group.activities.length === 1 ? (first ?? null) : null
  const additions = measuredSum(
    group.activities.map((activity) =>
      activity.details.kind === 'commit' ? activity.details.additions : null,
    ),
  )
  const deletions = measuredSum(
    group.activities.map((activity) =>
      activity.details.kind === 'commit' ? activity.details.deletions : null,
    ),
  )

  return {
    id: `commits:${group.key}:${group.project ?? ''}`,
    provider: group.provider,
    type: 'commit',
    variant: null,
    reference: null,
    title: single ? single.title : '',
    project: group.project,
    count: group.activities.length,
    measures: measuresOf(
      [
        ['linesAdded', additions],
        ['linesRemoved', deletions],
      ],
      group.activities.length,
    ),
    // A single commit already says everything about itself in the line.
    items: single ? [] : toItems(group.activities),
    url: single ? single.url : null,
    at: single ? single.occurredAt.toISOString() : null,
  }
}

const toSingleEntry = (activity: ActivityWithProject): JournalEntry | null => {
  const base = {
    id: activity.id,
    provider: activity.provider,
    type: activity.type,
    title: activity.title,
    project: activity.projectName,
    count: 1,
    items: [],
    url: activity.url,
    at: activity.occurredAt.toISOString(),
  }

  if (activity.details.kind === 'pull_request') {
    const details = activity.details
    return {
      ...base,
      variant: details.merged ? 'merged' : details.state === 'closed' ? 'closed' : 'opened',
      reference: `#${details.number}`,
      measures: measuresOf(
        [
          ['linesAdded', measuredSum([details.additions])],
          ['linesRemoved', measuredSum([details.deletions])],
        ],
        1,
      ),
    }
  }

  if (activity.details.kind === 'issue') {
    return {
      ...base,
      variant: activity.details.state === 'closed' ? 'closed' : 'opened',
      reference: `#${activity.details.number}`,
      measures: [],
    }
  }

  if (activity.details.kind === 'release') {
    return {
      ...base,
      variant: null,
      reference: activity.details.tagName,
      measures: [],
    }
  }

  return null
}

// The reader's own work, and only theirs: other people's activity and bots ride
// along in the same repositories but are not part of anyone's diary.
export const isOwnWork = (activity: ActivityWithProject): boolean =>
  activity.actor.isConnectedUser && !activity.actor.isBot

export const toEntries = (
  activities: ActivityWithProject[],
  timezone: string,
  bucket: CommitBucket,
): JournalEntry[] => {
  const commitGroups = new Map<string, CommitGroup>()
  const entries: JournalEntry[] = []

  for (const activity of activities) {
    if (activity.type === 'commit') {
      const key = commitBucketKey(activity, timezone, bucket)
      const groupKey = `${key}|${activity.projectName ?? ''}`
      const group = commitGroups.get(groupKey)
      if (group) {
        group.activities.push(activity)
      } else {
        commitGroups.set(groupKey, {
          key,
          provider: activity.provider,
          project: activity.projectName,
          activities: [activity],
        })
      }
      continue
    }

    const entry = toSingleEntry(activity)
    if (entry) {
      entries.push(entry)
    }
  }

  return [...entries, ...[...commitGroups.values()].map(toCommitEntry)]
}
