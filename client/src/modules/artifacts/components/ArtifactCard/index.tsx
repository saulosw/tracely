import { Link } from 'react-router'

import { Icon } from '@/shared/components/Icon'
import { CardRoot, Description, GlyphBox, Name } from './styles'

import type { ArtifactDefinition } from '../../artifacts'


type ArtifactCardProps = {
  artifact: ArtifactDefinition
}

export function ArtifactCard({ artifact }: ArtifactCardProps) {
  const available = Boolean(artifact.to)
  const routing = artifact.to
    ? { component: Link, to: artifact.to }
    : { component: 'article' as const }

  return (
    <CardRoot {...routing} available={available}>
      <GlyphBox available={available}>
        <Icon name={artifact.icon} />
      </GlyphBox>

      <Name variant="sectionTitle" available={available}>
        {artifact.name}
      </Name>

      <Description variant="body2">{artifact.description}</Description>
    </CardRoot>
  )
}
