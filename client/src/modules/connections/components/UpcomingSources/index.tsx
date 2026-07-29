import { SourceGlyph } from '@/shared/components/SourceGlyph'
import { upcomingSources } from '../../sources'
import { UpcomingGrid, UpcomingItem, UpcomingLabel, UpcomingRoot, UpcomingTitle } from './styles'


export function UpcomingSources() {
  return (
    <UpcomingRoot component="section">
      <UpcomingTitle variant="sectionTitle">Mais fontes, em breve</UpcomingTitle>

      <UpcomingGrid component="ul">
        {upcomingSources.map((source) => (
          <UpcomingItem key={source.id} component="li">
            <SourceGlyph source={source.id} label={source.name} />
            <UpcomingLabel variant="label">{source.name}</UpcomingLabel>
          </UpcomingItem>
        ))}
      </UpcomingGrid>
    </UpcomingRoot>
  )
}
