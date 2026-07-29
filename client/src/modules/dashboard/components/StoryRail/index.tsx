import { RailDot, RailEnd, RailEnds, RailLine, RailPulse, RailRoot, RailTrack } from './styles'


export function StoryRail() {
  return (
    <RailRoot>
      <RailTrack>
        <RailDot aria-hidden />
        <RailLine aria-hidden />
        <RailPulse aria-hidden />
      </RailTrack>

      <RailEnds>
        <RailEnd variant="meta">Dia um</RailEnd>
        <RailEnd variant="meta">não escrito</RailEnd>
      </RailEnds>
    </RailRoot>
  )
}
