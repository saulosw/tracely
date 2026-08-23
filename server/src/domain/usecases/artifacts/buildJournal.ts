import { isOwnWork, toEntries } from './journalEntries.js'
import { daysBetween, parseDayKey, zonedDayKey, zonedStampOf, zonedWeekday } from './zonedTime.js'

import type { CommitBucket } from './journalEntries.js'
import type {
  ActivityWithProject,
  JournalEntry,
  JournalGranularity,
  JournalPayload,
  JournalSection,
} from '../../entities/index.js'


const MAX_SECTIONS = 12
const MAX_ENTRIES_PER_SECTION = 20

export type BuildJournalInput = {
  activities: ActivityWithProject[]
  from: Date
  to: Date
  timezone: string
  truncated: boolean
}

type DayBucket = {
  from: string
  to: string
  activities: ActivityWithProject[]
}

const isWeekendKey = (key: string): boolean => {
  const day = parseDayKey(key)
  if (!day) {
    return false
  }
  const weekday = zonedWeekday(day)
  return weekday === 0 || weekday === 6
}

const spanInDays = (from: Date, to: Date, timezone: string): number => {
  const first = zonedStampOf(from, timezone)
  const last = zonedStampOf(to, timezone)
  return daysBetween(first, last) + 1
}

const byRecency = (first: JournalEntry, second: JournalEntry): number => {
  if (first.at && second.at) {
    return second.at.localeCompare(first.at)
  }
  if (first.at) {
    return -1
  }
  if (second.at) {
    return 1
  }
  return second.count - first.count
}

const byPriority = (first: JournalEntry, second: JournalEntry): number => {
  if (first.type === 'commit' && second.type !== 'commit') {
    return 1
  }
  if (second.type === 'commit' && first.type !== 'commit') {
    return -1
  }
  return byRecency(first, second)
}

const cap = (entries: JournalEntry[]): { entries: JournalEntry[]; overflow: number } => {
  if (entries.length <= MAX_ENTRIES_PER_SECTION) {
    return { entries: [...entries].sort(byRecency), overflow: 0 }
  }
  const kept = [...entries].sort(byPriority).slice(0, MAX_ENTRIES_PER_SECTION)
  return { entries: kept.sort(byRecency), overflow: entries.length - MAX_ENTRIES_PER_SECTION }
}

const toSection = (
  bucket: DayBucket,
  timezone: string,
  commitBucket: CommitBucket,
): JournalSection => {
  const { entries, overflow } = cap(toEntries(bucket.activities, timezone, commitBucket))
  return { from: bucket.from, to: bucket.to, overflow, entries }
}

const toDayBuckets = (
  activities: ActivityWithProject[],
  timezone: string,
): DayBucket[] => {
  const buckets = new Map<string, DayBucket>()

  for (const activity of activities) {
    const key = zonedDayKey(zonedStampOf(activity.occurredAt, timezone))
    const bucket = buckets.get(key)
    if (bucket) {
      bucket.activities.push(activity)
    } else {
      buckets.set(key, { from: key, to: key, activities: [activity] })
    }
  }

  return [...buckets.values()].sort((first, second) => second.from.localeCompare(first.from))
}

const mergeUntilCapped = (buckets: DayBucket[]): DayBucket[] => {
  const merged = [...buckets]

  while (merged.length > MAX_SECTIONS) {
    let target = 0
    let best = Number.POSITIVE_INFINITY
    let bestIsWeekend = false

    for (let index = 0; index < merged.length - 1; index += 1) {
      const newer = merged[index]
      const older = merged[index + 1]
      if (!newer || !older) {
        continue
      }
      const weight = newer.activities.length + older.activities.length
      const weekend = isWeekendKey(newer.to) && isWeekendKey(older.from)
      if (weight < best || (weight === best && weekend && !bestIsWeekend)) {
        target = index
        best = weight
        bestIsWeekend = weekend
      }
    }

    const newer = merged[target]
    const older = merged[target + 1]
    if (!newer || !older) {
      break
    }
    merged.splice(target, 2, {
      from: older.from,
      to: newer.to,
      activities: [...newer.activities, ...older.activities],
    })
  }

  return merged
}

export const buildJournal = (input: BuildJournalInput): JournalPayload => {
  const activities = input.activities.filter(isOwnWork)
  const span = spanInDays(input.from, input.to, input.timezone)
  const granularity: JournalGranularity = span <= 1 ? 'time' : 'day'

  const buckets = toDayBuckets(activities, input.timezone)
  const sections =
    granularity === 'time'
      ? buckets.map((bucket) => toSection(bucket, input.timezone, 'hour'))
      : mergeUntilCapped(buckets).map((bucket) =>
          toSection(bucket, input.timezone, bucket.from === bucket.to ? 'day' : 'span'),
        )

  return {
    kind: 'journal',
    granularity,
    activityCount: activities.length,
    truncated: input.truncated,
    sections,
  }
}
