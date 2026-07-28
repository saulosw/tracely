import { SourceGlyph } from '@/shared/components/SourceGlyph'
import { sources } from './sources'
import {
  RailLabel,
  RailLine,
  RailMarks,
  RailPulse,
  RailRoot,
  RailTrack,
  SourceNode,
} from './styles'


export function SourceRail() {
  return (
    <RailRoot>
      <RailLabel variant="eyebrow">Lê de onde você já trabalha</RailLabel>

      <RailTrack>
        <RailLine aria-hidden />
        <RailPulse aria-hidden />

        <RailMarks component="ul">
          {sources.map(({ id, label }) => (
            <SourceNode key={id} component="li">
              <SourceGlyph source={id} label={label} />
            </SourceNode>
          ))}
        </RailMarks>
      </RailTrack>
    </RailRoot>
  )
}
