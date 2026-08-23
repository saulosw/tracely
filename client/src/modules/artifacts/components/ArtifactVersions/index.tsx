import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router'

import { formatStamp } from '../../services/artifactFormat'
import {
  VersionCurrent,
  VersionList,
  VersionRow,
  VersionStamp,
  VersionsRoot,
  VersionsTitle,
} from './styles'

import type { ArtifactVersion } from '../../types'


type ArtifactVersionsProps = {
  versions: ArtifactVersion[]
  currentId: string
  timezone: string
}

export function ArtifactVersions({ versions, currentId, timezone }: ArtifactVersionsProps) {
  if (versions.length < 2) {
    return null
  }

  const numberOf = (index: number) => versions.length - index


  return (
    <VersionsRoot component="section">
      <VersionsTitle variant="eyebrow">Versões</VersionsTitle>

      <VersionList component="ul">
        {versions.map((version, index) =>
          version.id === currentId ? (
            <VersionCurrent key={version.id} component="li">
              <Typography variant="fine">Versão atual</Typography>
              <VersionStamp variant="fine">
                {formatStamp(version.generatedAt, timezone)}
              </VersionStamp>
            </VersionCurrent>
          ) : (
            <Box key={version.id} component="li">
              <VersionRow component={Link} to={`/artifacts/journal/${version.id}`}>
                <Typography variant="fine">v{numberOf(index)}</Typography>
                <VersionStamp variant="fine">
                  {formatStamp(version.generatedAt, timezone)}
                </VersionStamp>
              </VersionRow>
            </Box>
          ),
        )}
      </VersionList>
    </VersionsRoot>
  )
}
