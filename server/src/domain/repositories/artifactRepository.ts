import type { Artifact, ArtifactKind, ArtifactVersion, NewArtifact } from '../entities/index.js'


export type ArtifactListFilters = {
  userId: string
  kind?: ArtifactKind
  limit: number
  cursor?: { generatedAt: Date; id: string }
}

export type ArtifactRepository = {
  create(artifact: NewArtifact): Promise<Artifact>
  findById(id: string): Promise<Artifact | null>
  listLatestByUser(filters: ArtifactListFilters): Promise<Artifact[]>
  listVersions(rootId: string): Promise<ArtifactVersion[]>
}
