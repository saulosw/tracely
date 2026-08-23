import { describe, expect, it } from 'vitest'

import { journalArtifactPayload } from '@/test/graphql'
import { toMarkdown } from './journalMarkdown'

import type { Artifact } from '../types'


const artifact = { ...journalArtifactPayload, period: 'week' } as Artifact

describe('toMarkdown', () => {
  it('opens with the period the journal covers', () => {
    expect(toMarkdown(artifact)).toContain('# Diário — 27 de julho de 2026 — 2 de agosto de 2026')
  })

  it('writes each stretch as a heading and its entries as a list', () => {
    const markdown = toMarkdown(artifact)

    expect(markdown).toContain('### 31 de julho — Sexta-feira')
    expect(markdown).toContain(
      '- [Mergeou a PR #501 — nova camada de dispatch](https://github.com/octocat/hello-world/pull/501) · em octocat/hello-world · +410 linhas · −180 linhas',
    )
    expect(markdown).toContain('### 25 de jul. — 26 de jul. — Fim de semana')
  })

  it('carries the same honesty about partly measured numbers', () => {
    expect(toMarkdown(artifact)).toContain('+120 linhas ao menos')
  })

  it('lists the commits a grouped line stands for, each linked back', () => {
    const markdown = toMarkdown(artifact)

    expect(markdown).toContain(
      '  - 13:00 [ajusta o retry do dispatch](https://github.com/octocat/hello-world/commit/aaa)',
    )
    expect(markdown).toContain('  - e mais 4, não listadas aqui')
  })

  it('counts what the timeline left out', () => {
    expect(toMarkdown(artifact)).toContain('- e mais 3 atividades')
  })

  it('gives back nothing when the artifact carries no journal', () => {
    expect(toMarkdown({ ...artifact, journal: null })).toBe('')
  })
})
