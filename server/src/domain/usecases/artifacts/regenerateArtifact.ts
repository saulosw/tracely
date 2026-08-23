import { zonedDayKey, zonedStampOf } from './zonedTime.js'

import type { Artifact } from '../../entities/index.js'
import type { GenerateJournal } from './generateJournal.js'
import type { GetArtifact } from './getArtifact.js'


export type RegenerateArtifactInput = {
  userId: string
  artifactId: string
}

export type RegenerateArtifact = (input: RegenerateArtifactInput) => Promise<Artifact>

export const makeRegenerateArtifact = (deps: {
  getArtifact: GetArtifact
  generateJournal: GenerateJournal
}): RegenerateArtifact => {
  return async (input) => {
    const artifact = await deps.getArtifact(input)
    const custom =
      artifact.period === 'custom'
        ? {
            from: zonedDayKey(zonedStampOf(artifact.from, artifact.timezone)),
            to: zonedDayKey(zonedStampOf(artifact.to, artifact.timezone)),
          }
        : {}

    return deps.generateJournal({
      userId: input.userId,
      period: artifact.period,
      timezone: artifact.timezone,
      providers: artifact.providers,
      rootId: artifact.rootId,
      ...custom,
    })
  }
}
