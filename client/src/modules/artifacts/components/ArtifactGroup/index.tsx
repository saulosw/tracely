import Box from '@mui/material/Box'

import { Icon } from '@/shared/components/Icon'
import { ArtifactSummaryCard } from '../ArtifactSummaryCard'
import { GroupGlyph, GroupHead, GroupList, GroupName, GroupRoot } from './styles'

import type { ArtifactGroup as Group } from '../../services/artifactGroups'


type ArtifactGroupProps = {
  group: Group
}

export function ArtifactGroup({ group: { definition, items } }: ArtifactGroupProps) {
  return (
    <GroupRoot component="section" aria-labelledby={`group-${definition.id}`}>
      <GroupHead>
        <GroupGlyph>
          <Icon name={definition.icon} />
        </GroupGlyph>
        <GroupName id={`group-${definition.id}`} variant="sectionTitle" component="h2">
          {definition.name}
        </GroupName>
      </GroupHead>

      <GroupList component="ul">
        {items.map((artifact) => (
          <Box key={artifact.id} component="li">
            <ArtifactSummaryCard artifact={artifact} />
          </Box>
        ))}
      </GroupList>
    </GroupRoot>
  )
}
