import type { ArtifactVersion } from '../../entities/index.js'
import type { ArtifactRepository } from '../../repositories/index.js'
import type { GetArtifact } from './getArtifact.js'


export type ListArtifactVersionsInput = {
  userId: string
  artifactId: string
}

export type ListArtifactVersions = (
  input: ListArtifactVersionsInput,
) => Promise<ArtifactVersion[]>

export const makeListArtifactVersions = (deps: {
  artifactRepository: ArtifactRepository
  getArtifact: GetArtifact
}): ListArtifactVersions => {
  return async (input) => {
    const artifact = await deps.getArtifact(input)
    return deps.artifactRepository.listVersions(artifact.rootId)
  }
}
