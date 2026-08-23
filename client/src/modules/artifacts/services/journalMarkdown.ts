import {
  describeEntry,
  describeHiddenItems,
  describeMeasures,
  describeOverflow,
  describeProject,
} from '../components/JournalTimeline/sentences'
import { formatRange, formatSectionDate, formatSectionSpan, formatTime } from './artifactFormat'

import type { Artifact, JournalEntry, JournalSection } from '../types'


const itemsOf = (entry: JournalEntry, timezone: string): string[] => {
  const hidden = entry.count - entry.items.length
  const listed = entry.items.map((item) => {
    const label = item.url ? `[${item.title}](${item.url})` : item.title
    return `  - ${formatTime(item.at, timezone)} ${label}`
  })

  return hidden > 0 ? [...listed, `  - ${describeHiddenItems(hidden)}`] : listed
}

const lineOf = (entry: JournalEntry, timezone: string, byTime: boolean): string => {
  const time = byTime && entry.at ? `${formatTime(entry.at, timezone)} · ` : ''
  const detail = [describeProject(entry), ...describeMeasures(entry)].join(' · ')
  const headline = entry.url
    ? `[${describeEntry(entry)}](${entry.url})`
    : describeEntry(entry)

  return [`- ${time}${headline}${detail ? ` · ${detail}` : ''}`, ...itemsOf(entry, timezone)].join(
    '\n',
  )
}

const blockOf = (section: JournalSection, timezone: string, byTime: boolean): string => {
  const heading = byTime
    ? []
    : [`### ${formatSectionDate(section.from, section.to)} — ${formatSectionSpan(section.from, section.to)}`, '']
  const lines = section.entries.map((entry) => lineOf(entry, timezone, byTime))
  const overflow = section.overflow > 0 ? [`- ${describeOverflow(section.overflow)}`] : []

  return [...heading, ...lines, ...overflow, ''].join('\n')
}

export const toMarkdown = (artifact: Artifact): string => {
  const journal = artifact.journal
  if (!journal) {
    return ''
  }

  const byTime = journal.granularity === 'TIME'
  const header = [
    `# Diário — ${formatRange(artifact.from, artifact.to, artifact.timezone)}`,
    '',
    `${journal.activityCount} registros de atividade.`,
    '',
  ]

  return [
    ...header,
    ...journal.sections.map((section) => blockOf(section, artifact.timezone, byTime)),
  ]
    .join('\n')
    .trimEnd()
}
