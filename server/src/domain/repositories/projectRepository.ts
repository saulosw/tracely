import type { NewProject, Project } from '../entities/index.js'


export type ProjectRepository = {
  upsertMany(projects: NewProject[]): Promise<Project[]>
  listByConnection(connectionId: string): Promise<Project[]>
  markSynced(id: string, lastSyncedAt: Date): Promise<void>
}
