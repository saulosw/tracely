import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { authenticatedSession, journalArtifactPayload, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { JournalTimeline } from '.'

import type { JournalEntry, JournalPayload } from '../../types'


afterEach(() => {
  vi.unstubAllGlobals()
})

const TIMEZONE = 'America/Sao_Paulo'

const entry = (overrides: Partial<JournalEntry> = {}): JournalEntry => ({
  id: 'entry-1',
  provider: 'GITHUB',
  type: 'COMMIT',
  variant: null,
  reference: null,
  title: 'ajusta o retry',
  project: null,
  count: 1,
  measures: [],
  items: [],
  url: null,
  at: '2026-07-31T17:20:00.000Z',
  ...overrides,
})

const journalOf = (entries: JournalEntry[], overrides: Partial<JournalPayload> = {}): JournalPayload => ({
  granularity: 'DAY',
  activityCount: entries.length,
  truncated: false,
  sections: [{ from: '2026-07-31', to: '2026-07-31', overflow: 0, entries }],
  ...overrides,
})

const renderTimeline = (journal: JournalPayload) => {
  stubGraphQL(authenticatedSession())
  renderWithProviders(<JournalTimeline journal={journal} timezone={TIMEZONE} />, '/artifacts/journal/artifact-1')
}

describe('JournalTimeline', () => {
  it('names the day and its weekday on the rail', () => {
    renderTimeline(journalOf([entry()]))

    expect(screen.getByText('31 de julho')).toBeInTheDocument()
    expect(screen.getByText('Sexta-feira')).toBeInTheDocument()
  })

  it('reads a folded weekend as one stretch', () => {
    renderTimeline(
      journalOf([entry()], {
        sections: [{ from: '2026-07-25', to: '2026-07-26', overflow: 0, entries: [entry()] }],
      }),
    )

    expect(screen.getByText('25 de jul. — 26 de jul.')).toBeInTheDocument()
    expect(screen.getByText('Fim de semana')).toBeInTheDocument()
  })

  it('tells a single commit by its message and a batch by its size', () => {
    renderTimeline(journalOf([entry({ title: 'ajusta o retry' })]))
    expect(screen.getByText(/ajusta o retry/)).toBeInTheDocument()

    renderTimeline(journalOf([entry({ id: 'batch', title: '', count: 6 })]))
    expect(screen.getByText(/6 commits/)).toBeInTheDocument()
  })

  it('reads each shape of pull request differently', () => {
    const pull = (variant: string) =>
      entry({ id: variant, type: 'PULL_REQUEST', variant, reference: '#501', title: 'dispatch' })

    renderTimeline(journalOf([pull('merged')]))
    expect(screen.getByText(/Mergeou a PR #501 — dispatch/)).toBeInTheDocument()

    renderTimeline(journalOf([pull('opened')]))
    expect(screen.getByText(/Abriu a PR #501 — dispatch/)).toBeInTheDocument()

    renderTimeline(journalOf([pull('closed')]))
    expect(screen.getByText(/Fechou a PR #501 — dispatch/)).toBeInTheDocument()
  })

  it('says a measured number is a floor when only part of the sample answered', () => {
    renderTimeline(
      journalOf([
        entry({
          count: 6,
          title: '',
          measures: [
            { key: 'linesAdded', value: 120, partial: true },
            { key: 'linesRemoved', value: 40, partial: false },
          ],
        }),
      ]),
    )

    expect(screen.getByText(/\+120 linhas ao menos/)).toBeInTheDocument()
    expect(screen.getByText(/−40 linhas/)).toBeInTheDocument()
  })

  it('skips a measure it has no words for instead of printing its key', () => {
    renderTimeline(
      journalOf([entry({ measures: [{ key: 'attendees', value: 4, partial: false }] })]),
    )

    expect(screen.queryByText(/attendees/)).not.toBeInTheDocument()
  })

  it('does not leave a dangling dash when the source gave no title', () => {
    renderTimeline(
      journalOf([entry({ type: 'PULL_REQUEST', variant: 'merged', reference: '#501', title: '' })]),
    )

    expect(screen.getByText('Mergeou a PR #501')).toBeInTheDocument()
  })

  it('names an activity it has no words for instead of rendering an empty line', () => {
    renderTimeline(
      journalOf([entry({ type: 'MEETING' as JournalEntry['type'], title: '', count: 1 })]),
    )

    expect(screen.getByText('1 registro')).toBeInTheDocument()
  })

  it('counts what it left out of a crowded stretch', () => {
    renderTimeline(
      journalOf([entry()], {
        sections: [{ from: '2026-07-31', to: '2026-07-31', overflow: 3, entries: [entry()] }],
      }),
    )

    expect(screen.getByText('e mais 3 atividades')).toBeInTheDocument()
  })

  it('reads a single day by the clock instead of by date', () => {
    renderTimeline(journalOf([entry()], { granularity: 'TIME' }))

    expect(screen.getByText('14:20')).toBeInTheDocument()
    expect(screen.queryByText('31 de julho')).not.toBeInTheDocument()
  })

  it('links an entry to where it happened when the source gave a link', () => {
    renderTimeline(
      journalOf([entry({ url: 'https://github.com/octocat/hello-world/pull/501', title: 'dispatch' })]),
    )

    expect(screen.getByRole('link', { name: /dispatch/ })).toHaveAttribute(
      'href',
      'https://github.com/octocat/hello-world/pull/501',
    )
  })

  it('shows the mark of the source each entry came from', () => {
    renderTimeline(journalOf(journalArtifactPayload.journal.sections[0].entries as JournalEntry[]))

    expect(screen.getAllByText(/Mergeou a PR/)).not.toHaveLength(0)
  })
})
