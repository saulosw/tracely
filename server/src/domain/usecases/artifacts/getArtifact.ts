import { NotFoundError } from '../../errors/index.js'
import { isUuid } from './uuid.js'

import type { Artifact } from '../../entities/index.js'
import type { ArtifactRepository } from '../../repositories/index.js'


export type GetArtifactInput = {
  userId: string
  artifactId: string
}

export type GetArtifact = (input: GetArtifactInput) => Promise<Artifact>

export const makeGetArtifact = (deps: {
  artifactRepository: ArtifactRepository
}): GetArtifact => {
  return async (input) => {
    if (!isUuid(input.artifactId)) {
      throw new NotFoundError('Artifact not found')
    }
    const artifact = await deps.artifactRepository.findById(input.artifactId)
    if (!artifact || artifact.userId !== input.userId) {
      throw new NotFoundError('Artifact not found')
    }
    return artifact
  }
}
