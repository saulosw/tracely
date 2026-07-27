import { and, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm'

import { activities, connections, projects } from '../database/schema/index.js'
import { chunked } from './rows.js'

import type { Activity, ActivityRepository, NewActivity } from '../../domain/index.js'
import type { Database } from '../database/index.js'


const UPSERT_CHUNK_SIZE = 500

type ActivityRow = typeof activities.$inferSelect

const toRow = (activity: NewActivity) => ({
  connectionId: activity.connectionId,
  projectId: activity.projectId,
  provider: activity.provider,
  type: activity.type,
  externalId: activity.externalId,
  title: activity.title,
  summary: activity.summary,
  url: activity.url,
  actorExternalId: activity.actor.externalId,
  actorLogin: activity.actor.login,
  actorIsConnectedUser: activity.actor.isConnectedUser,
  actorIsBot: activity.actor.isBot,
  occurredAt: activity.occurredAt,
  details: activity.details,
})

const toActivity = (row: ActivityRow): Activity => ({
  id: row.id,
  connectionId: row.connectionId,
  projectId: row.projectId,
  provider: row.provider,
  type: row.type,
  externalId: row.externalId,
  title: row.title,
  summary: row.summary,
  url: row.url,
  actor: {
    externalId: row.actorExternalId,
    login: row.actorLogin,
    isConnectedUser: row.actorIsConnectedUser,
    isBot: row.actorIsBot,
  },
  occurredAt: row.occurredAt,
  details: row.details,
  recordedAt: row.recordedAt,
})

export const createDrizzleActivityRepository = (db: Database): ActivityRepository => ({
  async upsertMany(items) {
    let count = 0
    for (const chunk of chunked(items, UPSERT_CHUNK_SIZE)) {
      const rows = await db
        .insert(activities)
        .values(chunk.map(toRow))
        .onConflictDoUpdate({
          target: [activities.connectionId, activities.type, activities.externalId],
          set: {
            projectId: sql`excluded.project_id`,
            title: sql`excluded.title`,
            summary: sql`excluded.summary`,
            url: sql`excluded.url`,
            actorExternalId: sql`excluded.actor_external_id`,
            actorLogin: sql`excluded.actor_login`,
            actorIsConnectedUser: sql`excluded.actor_is_connected_user`,
            actorIsBot: sql`excluded.actor_is_bot`,
            occurredAt: sql`excluded.occurred_at`,
            details: sql`excluded.details`,
          },
        })
        .returning({ id: activities.id })
      count += rows.length
    }
    return count
  },

  async listByUserAndRange(filters) {
    const conditions = [
      eq(connections.userId, filters.userId),
      gte(activities.occurredAt, filters.from),
      lte(activities.occurredAt, filters.to),
    ]
    if (filters.providers?.length) {
      conditions.push(inArray(activities.provider, filters.providers))
    }
    if (filters.types?.length) {
      conditions.push(inArray(activities.type, filters.types))
    }
    if (filters.projectIds?.length) {
      conditions.push(inArray(activities.projectId, filters.projectIds))
    }
    if (filters.cursor) {
      conditions.push(
        sql`(${activities.occurredAt}, ${activities.id}) < (${filters.cursor.occurredAt}, ${filters.cursor.id}::uuid)`,
      )
    }

    const rows = await db
      .select({
        activity: activities,
        projectName: projects.name,
        projectFullName: projects.fullName,
      })
      .from(activities)
      .innerJoin(connections, eq(activities.connectionId, connections.id))
      .leftJoin(projects, eq(activities.projectId, projects.id))
      .where(and(...conditions))
      .orderBy(desc(activities.occurredAt), desc(activities.id))
      .limit(filters.limit)

    return rows.map((row) => ({
      ...toActivity(row.activity),
      projectName: row.projectName,
      projectFullName: row.projectFullName,
    }))
  },
})
