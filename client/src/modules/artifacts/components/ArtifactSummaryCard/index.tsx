import Box from '@mui/material/Box'
import { Link } from 'react-router'

import { artifactPath } from '../../artifacts'
import { formatRange, formatStamp } from '../../services/artifactFormat'
import { CardRoot, Count, Range, Stamp } from './styles'

import type { ArtifactSummary } from '../../types'


type ArtifactSummaryCardProps = {
  artifact: ArtifactSummary
}

export function ArtifactSummaryCard({ artifact }: ArtifactSummaryCardProps) {
  const path = artifactPath(artifact.kind, artifact.id)
  const routing = path ? { component: Link, to: path } : { component: 'article' as const }

  return (
    <CardRoot {...routing}>
      <Box>
        <Range variant="sectionTitle">
          {formatRange(artifact.from, artifact.to, artifact.timezone)}
        </Range>
        <Stamp variant="fine">
          Gerado em {formatStamp(artifact.generatedAt, artifact.timezone)}
        </Stamp>
      </Box>

      <Count variant="meta">{artifact.activityCount}</Count>
    </CardRoot>
  )
}
