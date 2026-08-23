import { useState } from 'react'

import { sourceIdOf } from '@/modules/connections'
import { Icon } from '@/shared/components/Icon'
import { SourceGlyph } from '@/shared/components/SourceGlyph'
import { formatTime } from '../../services/artifactFormat'
import {
  describeEntry,
  describeHiddenItems,
  describeMeasures,
  describeProject,
} from '../JournalTimeline/sentences'
import {
  Chevron,
  Disclosure,
  EntryBody,
  EntryDetail,
  EntryLink,
  EntryRoot,
  EntryTag,
  EntryText,
  EntryTime,
  ItemLink,
  ItemList,
  ItemNote,
  ItemRow,
  ItemText,
  ItemTime,
} from './styles'

import type { JournalEntry } from '../../types'


type JournalEntryLineProps = {
  entry: JournalEntry
  timezone: string
  showTime: boolean
}

export function JournalEntryLine({ entry, timezone, showTime }: JournalEntryLineProps) {
  const [open, setOpen] = useState(false)
  const headline = describeEntry(entry)
  const detail = [describeProject(entry), ...describeMeasures(entry)].join(' · ')
  const hidden = entry.count - entry.items.length


  return (
    <EntryRoot component="li">
      {showTime && entry.at ? (
        <EntryTime variant="meta">{formatTime(entry.at, timezone)}</EntryTime>
      ) : null}

      <EntryBody>
        {entry.items.length > 0 ? (
          <>
            <Disclosure aria-expanded={open} onClick={() => setOpen(!open)}>
              <span>
                {headline}
                {detail ? <EntryDetail> · {detail}</EntryDetail> : null}
              </span>
              <Chevron open={open}>
                <Icon name="expand" />
              </Chevron>
            </Disclosure>

            {open ? (
              <ItemList component="ul">
                {entry.items.map((item) => (
                  <ItemRow key={item.id} component="li">
                    <ItemTime variant="fine">{formatTime(item.at, timezone)}</ItemTime>
                    {item.url ? (
                      <ItemLink href={item.url} target="_blank" rel="noreferrer" variant="fine">
                        {item.title}
                      </ItemLink>
                    ) : (
                      <ItemText variant="fine">{item.title}</ItemText>
                    )}
                  </ItemRow>
                ))}

                {hidden > 0 ? (
                  <ItemNote variant="fine" component="li">
                    {describeHiddenItems(hidden)}
                  </ItemNote>
                ) : null}
              </ItemList>
            ) : null}
          </>
        ) : entry.url ? (
          <EntryLink href={entry.url} target="_blank" rel="noreferrer" underline="none">
            {headline}
            {detail ? <EntryDetail> · {detail}</EntryDetail> : null}
          </EntryLink>
        ) : (
          <EntryText>
            {headline}
            {detail ? <EntryDetail> · {detail}</EntryDetail> : null}
          </EntryText>
        )}
      </EntryBody>

      <EntryTag>
        <SourceGlyph source={sourceIdOf(entry.provider)} />
      </EntryTag>
    </EntryRoot>
  )
}
