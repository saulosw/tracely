import { eq, sql } from 'drizzle-orm'

import { projects } from '../database/schema/index.js'
import { chunked } from './rows.js'

import type { Project, ProjectRepository } from '../../domain/index.js'
import type { Database } from '../database/index.js'


const UPSERT_CHUNK_SIZE = 200

export const createDrizzleProjectRepository = (db: Database): ProjectRepository => ({
  async upsertMany(items) {
    const result: Project[] = []
    for (const chunk of chunked(items, UPSERT_CHUNK_SIZE)) {
      const rows = await db
        .insert(projects)
        .values(chunk)
        .onConflictDoUpdate({
          target: [projects.connectionId, projects.externalId],
          set: {
            name: sql`excluded.name`,
            fullName: sql`excluded.full_name`,
            ownerLogin: sql`excluded.owner_login`,
            description: sql`excluded.description`,
            visibility: sql`excluded.visibility`,
            isFork: sql`excluded.is_fork`,
            isArchived: sql`excluded.is_archived`,
            defaultBranch: sql`excluded.default_branch`,
            primaryLanguage: sql`excluded.primary_language`,
            providerCreatedAt: sql`excluded.provider_created_at`,
            providerPushedAt: sql`excluded.provider_pushed_at`,
            updatedAt: new Date(),
          },
        })
        .returning()
      result.push(...rows)
    }
    return result
  },

  async listByConnection(connectionId) {
    return db.select().from(projects).where(eq(projects.connectionId, connectionId))
  },

  async markSynced(id, lastSyncedAt) {
    await db
      .update(projects)
      .set({ lastSyncedAt, updatedAt: new Date() })
      .where(eq(projects.id, id))
  },
})
