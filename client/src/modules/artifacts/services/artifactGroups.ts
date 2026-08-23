import { artifacts } from '../artifacts'

import type { ArtifactDefinition } from '../artifacts'
import type { ArtifactSummary } from '../types'


export type ArtifactGroup = {
  definition: ArtifactDefinition
  items: ArtifactSummary[]
}

export const groupArtifactsByKind = (items: ArtifactSummary[]): ArtifactGroup[] =>
  artifacts
    .map((definition) => ({
      definition,
      items: items.filter((item) => item.kind === definition.id),
    }))
    .filter((group) => group.items.length > 0)
