import { describe, expect, it } from 'vitest'

import { groupArtifactsByKind } from './artifactGroups'

import type { ArtifactKind, ArtifactSummary } from '../types'


const summary = (id: string, kind: ArtifactKind | null): ArtifactSummary => ({
  id,
  kind,
  from: '2026-07-27T03:00:00.000Z',
  to: '2026-08-03T02:59:59.999Z',
  timezone: 'America/Sao_Paulo',
  activityCount: 12,
  generatedAt: '2026-08-03T12:00:00.000Z',
})

describe('groupArtifactsByKind', () => {
  it('leaves out the kinds the reader has nothing of', () => {
    const groups = groupArtifactsByKind([summary('artifact-1', 'journal')])

    expect(groups).toHaveLength(1)
    expect(groups[0]?.definition.id).toBe('journal')
    expect(groups[0]?.definition.name).toBe('Diário')
  })

  it('gives back nothing when the reader has nothing', () => {
    expect(groupArtifactsByKind([])).toEqual([])
  })

  it('keeps the order the server sent inside the group', () => {
    const groups = groupArtifactsByKind([
      summary('newest', 'journal'),
      summary('oldest', 'journal'),
    ])

    expect(groups[0]?.items.map(({ id }) => id)).toEqual(['newest', 'oldest'])
  })

  it('sets aside artifacts of a kind it does not know', () => {
    expect(groupArtifactsByKind([summary('artifact-1', null)])).toEqual([])
  })
})
