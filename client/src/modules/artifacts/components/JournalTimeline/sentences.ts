import { formatNumber } from '../../services/artifactFormat'

import type { JournalEntry } from '../../types'


type SentenceTemplate = { one: string; many: string }

const sentences: Record<string, SentenceTemplate> = {
  COMMIT: { one: '{title}', many: '{count} commits' },
  'PULL_REQUEST:merged': { one: 'Mergeou a PR {reference} — {title}', many: '{count} pull requests mergeadas' },
  'PULL_REQUEST:opened': { one: 'Abriu a PR {reference} — {title}', many: '{count} pull requests abertas' },
  'PULL_REQUEST:closed': { one: 'Fechou a PR {reference} — {title}', many: '{count} pull requests fechadas' },
  'ISSUE:opened': { one: 'Abriu a issue {reference} — {title}', many: '{count} issues abertas' },
  'ISSUE:closed': { one: 'Fechou a issue {reference} — {title}', many: '{count} issues fechadas' },
  RELEASE: { one: 'Publicou a release {reference}', many: '{count} releases' },
}

const unnamed = (count: number): string =>
  count === 1 ? '1 registro' : `${formatNumber(count)} registros`

const measures: Record<string, string> = {
  linesAdded: '+{value} linhas',
  linesRemoved: '−{value} linhas',
  filesChanged: '{value} arquivos',
}

const fill = (template: string, values: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (match, token: string) => values[token] ?? match)

const templateFor = (entry: JournalEntry): SentenceTemplate | undefined =>
  sentences[`${entry.type}:${entry.variant ?? ''}`] ?? sentences[entry.type]

export const describeEntry = (entry: JournalEntry): string => {
  const template = templateFor(entry)
  if (!template) {
    return unnamed(entry.count)
  }

  const filled = fill(entry.count > 1 ? template.many : template.one, {
    count: formatNumber(entry.count),
    title: entry.title,
    reference: entry.reference ?? '',
  })
    .replace(/\s*—\s*$/, '')
    .trim()

  return filled === '' ? unnamed(entry.count) : filled
}

export const describeProject = (entry: JournalEntry): string | null =>
  entry.project ? `em ${entry.project}` : null

export const describeMeasures = (entry: JournalEntry): string[] =>
  entry.measures.flatMap((measure) => {
    const template = measures[measure.key]
    if (!template) {
      return []
    }
    const text = fill(template, { value: formatNumber(measure.value) })
    return [measure.partial ? `${text} ao menos` : text]
  })

export const describeHiddenItems = (count: number): string =>
  count === 1 ? 'e mais 1, não listada aqui' : `e mais ${formatNumber(count)}, não listadas aqui`

export const describeOverflow = (count: number): string =>
  count === 1 ? 'e mais 1 atividade' : `e mais ${formatNumber(count)} atividades`
