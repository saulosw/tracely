import Box from '@mui/material/Box'

import { JournalEntryLine } from '../JournalEntryLine'
import { formatSectionDate, formatSectionSpan } from '../../services/artifactFormat'
import { describeOverflow } from './sentences'
import {
  EntryList,
  Overflow,
  Rail,
  RailDate,
  RailSpan,
  SectionRoot,
  TimelineRoot,
} from './styles'

import type { JournalPayload } from '../../types'


type JournalTimelineProps = {
  journal: JournalPayload
  timezone: string
}

export function JournalTimeline({ journal, timezone }: JournalTimelineProps) {
  const byTime = journal.granularity === 'TIME'


  return (
    <TimelineRoot component="ol">
      {journal.sections.map((section) => (
        <SectionRoot key={`${section.from}-${section.to}`} component="li" railed={!byTime}>
          {byTime ? null : (
            <Rail>
              <RailDate variant="meta">{formatSectionDate(section.from, section.to)}</RailDate>
              <RailSpan variant="fine">{formatSectionSpan(section.from, section.to)}</RailSpan>
            </Rail>
          )}

          <Box>
            <EntryList component="ul">
              {section.entries.map((entry) => (
                <JournalEntryLine
                  key={entry.id}
                  entry={entry}
                  timezone={timezone}
                  showTime={byTime}
                />
              ))}
            </EntryList>

            {section.overflow > 0 ? (
              <Overflow variant="fine">{describeOverflow(section.overflow)}</Overflow>
            ) : null}
          </Box>
        </SectionRoot>
      ))}
    </TimelineRoot>
  )
}
