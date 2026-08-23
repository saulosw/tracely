import { describe, expect, it } from 'vitest'

import { buildJournal } from '../../src/domain/index.js'

import type { ActivityWithProject, JournalEntry } from '../../src/domain/index.js'


const TIMEZONE = 'America/Sao_Paulo'

type CommitOverrides = {
  id?: string
  at?: string
  project?: string | null
  additions?: number | null
  deletions?: number | null
  isConnectedUser?: boolean
  isBot?: boolean
  title?: string
}

const commit = (overrides: CommitOverrides = {}): ActivityWithProject => ({
  id: overrides.id ?? 'commit-1',
  connectionId: 'conn-1',
  projectId: 'project-1',
  provider: 'github',
  type: 'commit',
  externalId: overrides.id ?? 'commit-1',
  title: overrides.title ?? 'ajusta o retry',
  summary: null,
  url: 'https://github.com/octocat/hello-world/commit/abc',
  actor: {
    externalId: '42',
    login: 'octocat',
    isConnectedUser: overrides.isConnectedUser ?? true,
    isBot: overrides.isBot ?? false,
  },
  occurredAt: new Date(overrides.at ?? '2026-07-10T14:00:00Z'),
  details: {
    kind: 'commit',
    sha: 'abc',
    message: overrides.title ?? 'ajusta o retry',
    authorName: null,
    authorEmail: null,
    branch: null,
    additions: overrides.additions ?? null,
    deletions: overrides.deletions ?? null,
    filesChanged: null,
    files: null,
    filesTruncated: true,
  },
  recordedAt: new Date(),
  projectName: overrides.project === undefined ? 'hello-world' : overrides.project,
  projectFullName: 'octocat/hello-world',
})

const pullRequest = (
  overrides: { merged?: boolean; state?: 'open' | 'closed'; at?: string } = {},
): ActivityWithProject => ({
  id: 'pr-1',
  connectionId: 'conn-1',
  projectId: 'project-1',
  provider: 'github',
  type: 'pull_request',
  externalId: '501',
  title: 'nova camada de dispatch',
  summary: null,
  url: 'https://github.com/octocat/hello-world/pull/501',
  actor: { externalId: '42', login: 'octocat', isConnectedUser: true, isBot: false },
  occurredAt: new Date(overrides.at ?? '2026-07-10T18:00:00Z'),
  details: {
    kind: 'pull_request',
    number: 501,
    state: overrides.state ?? 'closed',
    isDraft: false,
    merged: overrides.merged ?? true,
    createdAt: '2026-07-09T10:00:00Z',
    mergedAt: '2026-07-10T18:00:00Z',
    baseBranch: 'main',
    headBranch: 'feat/dispatch',
    additions: 410,
    deletions: 180,
    changedFiles: 12,
    commits: 4,
    labels: [],
    comments: 0,
  },
  recordedAt: new Date(),
  projectName: 'hello-world',
  projectFullName: 'octocat/hello-world',
})

const oneWeek = {
  from: new Date('2026-07-06T03:00:00Z'),
  to: new Date('2026-07-12T02:59:59.999Z'),
  timezone: TIMEZONE,
  truncated: false,
}

const entriesOf = (sections: { entries: JournalEntry[] }[]): JournalEntry[] =>
  sections.flatMap((section) => section.entries)

describe('buildJournal', () => {
  it('leaves out work that is not the reader own', () => {
    const payload = buildJournal({
      ...oneWeek,
      activities: [
        commit({ id: 'mine' }),
        commit({ id: 'someone-else', isConnectedUser: false }),
        commit({ id: 'a-bot', isBot: true }),
      ],
    })

    expect(payload.activityCount).toBe(1)
    expect(entriesOf(payload.sections)).toHaveLength(1)
  })

  it('gathers the commits of a day into one entry per project', () => {
    const payload = buildJournal({
      ...oneWeek,
      activities: [
        commit({ id: 'c1', at: '2026-07-10T14:00:00Z' }),
        commit({ id: 'c2', at: '2026-07-10T16:00:00Z' }),
        commit({ id: 'c3', at: '2026-07-10T17:00:00Z', project: 'dotfiles' }),
      ],
    })

    const [section] = payload.sections
    expect(section?.entries).toHaveLength(2)
    expect(section?.entries.find((entry) => entry.project === 'hello-world')?.count).toBe(2)
    expect(section?.entries.find((entry) => entry.project === 'dotfiles')?.count).toBe(1)
  })

  it('keeps the message and the instant when a project saw a single commit', () => {
    const payload = buildJournal({
      ...oneWeek,
      activities: [commit({ title: 'ajusta o retry', at: '2026-07-10T14:00:00Z' })],
    })

    const [entry] = entriesOf(payload.sections)
    expect(entry?.title).toBe('ajusta o retry')
    expect(entry?.at).toBe('2026-07-10T14:00:00.000Z')
  })

  it('drops the message when the entry stands for several commits', () => {
    const payload = buildJournal({
      ...oneWeek,
      activities: [commit({ id: 'c1' }), commit({ id: 'c2', title: 'outro' })],
    })

    const [entry] = entriesOf(payload.sections)
    expect(entry?.title).toBe('')
    expect(entry?.at).toBeNull()
  })

  it('reads a pull request as merged, opened or closed', () => {
    const variantOf = (activity: ActivityWithProject) =>
      entriesOf(buildJournal({ ...oneWeek, activities: [activity] }).sections)[0]?.variant

    expect(variantOf(pullRequest({ merged: true }))).toBe('merged')
    expect(variantOf(pullRequest({ merged: false, state: 'closed' }))).toBe('closed')
    expect(variantOf(pullRequest({ merged: false, state: 'open' }))).toBe('opened')
  })

  it('names the pull request by its number', () => {
    const [entry] = entriesOf(buildJournal({ ...oneWeek, activities: [pullRequest()] }).sections)

    expect(entry?.reference).toBe('#501')
    expect(entry?.measures).toEqual([
      { key: 'linesAdded', value: 410, partial: false },
      { key: 'linesRemoved', value: 180, partial: false },
    ])
  })

  it('adds up only the commits the provider could measure, and says the total is a floor', () => {
    const payload = buildJournal({
      ...oneWeek,
      activities: [
        commit({ id: 'c1', additions: 30, deletions: 10 }),
        commit({ id: 'c2', additions: 12, deletions: null }),
        commit({ id: 'c3' }),
      ],
    })

    const [entry] = entriesOf(payload.sections)
    expect(entry?.count).toBe(3)
    expect(entry?.measures).toEqual([
      { key: 'linesAdded', value: 42, partial: true },
      { key: 'linesRemoved', value: 10, partial: true },
    ])
  })

  it('leaves a measure out entirely when nothing could answer it', () => {
    const payload = buildJournal({ ...oneWeek, activities: [commit(), commit({ id: 'c2' })] })

    expect(entriesOf(payload.sections)[0]?.measures).toEqual([])
  })

  it('keeps every commit a grouped entry stands for, so each can be followed back', () => {
    const payload = buildJournal({
      ...oneWeek,
      activities: [
        commit({ id: 'c1', title: 'primeiro', at: '2026-07-10T14:00:00Z' }),
        commit({ id: 'c2', title: 'segundo', at: '2026-07-10T16:00:00Z' }),
      ],
    })

    const [entry] = entriesOf(payload.sections)
    expect(entry?.count).toBe(2)
    expect(entry?.items.map((item) => item.title)).toEqual(['segundo', 'primeiro'])
    expect(entry?.items[0]?.url).toBe('https://github.com/octocat/hello-world/commit/abc')
  })

  it('does not repeat a lone commit as an item of itself', () => {
    const payload = buildJournal({ ...oneWeek, activities: [commit()] })

    expect(entriesOf(payload.sections)[0]?.items).toEqual([])
  })

  it('stops listing the commits of a group before the payload turns into a log', () => {
    const payload = buildJournal({
      ...oneWeek,
      activities: Array.from({ length: 40 }, (_, index) =>
        commit({ id: `c${index}`, at: '2026-07-10T14:00:00Z' }),
      ),
    })

    const [entry] = entriesOf(payload.sections)
    expect(entry?.count).toBe(40)
    expect(entry?.items).toHaveLength(25)
  })

  it('reads a period with no activity as a journal with no sections', () => {
    const payload = buildJournal({ ...oneWeek, activities: [] })

    expect(payload.sections).toEqual([])
    expect(payload.activityCount).toBe(0)
  })

  it('carries the reading limit through to the payload', () => {
    const payload = buildJournal({ ...oneWeek, activities: [commit()], truncated: true })

    expect(payload.truncated).toBe(true)
  })
})
