import { describe, expect, it } from 'vitest'

import { buildJournal } from '../../src/domain/index.js'

import type { ActivityWithProject } from '../../src/domain/index.js'


const TIMEZONE = 'America/Sao_Paulo'

const at = (day: string, hour = 12): Date => new Date(`${day}T${String(hour).padStart(2, '0')}:00:00-03:00`)

const commitOn = (day: string, index: number, hour = 12): ActivityWithProject => ({
  id: `${day}-${index}`,
  connectionId: 'conn-1',
  projectId: 'project-1',
  provider: 'github',
  type: 'commit',
  externalId: `${day}-${index}`,
  title: `commit ${index}`,
  summary: null,
  url: null,
  actor: { externalId: '42', login: 'octocat', isConnectedUser: true, isBot: false },
  occurredAt: at(day, hour),
  details: {
    kind: 'commit',
    sha: `${day}-${index}`,
    message: `commit ${index}`,
    authorName: null,
    authorEmail: null,
    branch: null,
    additions: null,
    deletions: null,
    filesChanged: null,
    files: null,
    filesTruncated: true,
  },
  recordedAt: new Date(),
  projectName: 'hello-world',
  projectFullName: 'octocat/hello-world',
})

const dayKeysOf = (day: number): string => `2026-07-${String(day).padStart(2, '0')}`

const journalOver = (
  fromDay: number,
  toDay: number,
  activities: ActivityWithProject[],
) =>
  buildJournal({
    activities,
    from: at(dayKeysOf(fromDay), 0),
    to: at(dayKeysOf(toDay), 23),
    timezone: TIMEZONE,
    truncated: false,
  })

describe('journal sections', () => {
  it('reads a single day by the clock instead of by date', () => {
    const payload = journalOver(10, 10, [
      commitOn('2026-07-10', 1, 9),
      commitOn('2026-07-10', 2, 9),
      commitOn('2026-07-10', 3, 17),
    ])

    expect(payload.granularity).toBe('time')
    expect(payload.sections[0]?.entries).toHaveLength(2)
    expect(payload.sections[0]?.entries.map((entry) => entry.count).sort()).toEqual([1, 2])
  })

  it('gives a short period one section per day that saw work', () => {
    const payload = journalOver(6, 12, [
      commitOn('2026-07-06', 1),
      commitOn('2026-07-08', 1),
      commitOn('2026-07-08', 2),
    ])

    expect(payload.granularity).toBe('day')
    expect(payload.sections.map((section) => section.from)).toEqual(['2026-07-08', '2026-07-06'])
  })

  it('never invents a section for a day with nothing in it', () => {
    const payload = journalOver(6, 12, [commitOn('2026-07-09', 1)])

    expect(payload.sections).toHaveLength(1)
    expect(payload.sections[0]).toMatchObject({ from: '2026-07-09', to: '2026-07-09' })
  })

  it('folds a long month into a timeline that can still be read', () => {
    const activities = Array.from({ length: 31 }, (_, index) =>
      commitOn(dayKeysOf(index + 1), 1),
    )

    const payload = journalOver(1, 31, activities)

    expect(payload.sections.length).toBeLessThanOrEqual(12)
    expect(payload.activityCount).toBe(31)
    const counted = payload.sections.reduce(
      (total, section) => total + section.entries.reduce((sum, entry) => sum + entry.count, 0),
      0,
    )
    expect(counted).toBe(31)
  })

  it('folds the quiet weekend before a busy pair of weekdays', () => {
    const activities = [
      ...Array.from({ length: 20 }, (_, index) => commitOn('2026-07-10', index)),
      commitOn('2026-07-11', 1),
      commitOn('2026-07-12', 1),
      ...Array.from({ length: 20 }, (_, index) => commitOn('2026-07-13', index)),
      ...Array.from({ length: 12 }, (_, index) => commitOn(dayKeysOf(14 + index), 1)),
    ]

    const payload = journalOver(10, 25, activities)

    const weekend = payload.sections.find((section) => section.from === '2026-07-11')
    expect(weekend).toMatchObject({ from: '2026-07-11', to: '2026-07-12' })
  })

  it('keeps a crowded section readable and counts what it left out', () => {
    const activities = Array.from({ length: 30 }, (_, index) => ({
      ...commitOn('2026-07-10', index),
      projectName: `repo-${index}`,
    }))

    const payload = journalOver(6, 12, activities)

    const [section] = payload.sections
    expect(section?.entries).toHaveLength(20)
    expect(section?.overflow).toBe(10)
  })

  it('reads the same activity the same way twice', () => {
    const activities = Array.from({ length: 31 }, (_, index) =>
      commitOn(dayKeysOf(index + 1), 1),
    )

    expect(journalOver(1, 31, activities)).toEqual(journalOver(1, 31, activities))
  })
})
