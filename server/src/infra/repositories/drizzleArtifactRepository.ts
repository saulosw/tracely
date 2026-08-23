import { randomUUID } from 'node:crypto'
import { and, desc, eq, sql } from 'drizzle-orm'

import { artifactPayloadSchema } from '../../domain/index.js'
import { artifacts } from '../database/schema/index.js'
import { requireRow } from './rows.js'

import type { Artifact, ArtifactRepository } from '../../domain/index.js'
import type { Database } from '../database/index.js'


type ArtifactRow = typeof artifacts.$inferSelect

const toArtifact = (row: ArtifactRow): Artifact => ({
  id: row.id,
  userId: row.userId,
  rootId: row.rootId,
  kind: row.kind,
  period: row.period,
  from: row.rangeFrom,
  to: row.rangeTo,
  timezone: row.timezone,
  providers: row.providers,
  payload: artifactPayloadSchema.parse(row.payload),
  generatedAt: row.generatedAt,
})

export const createDrizzleArtifactRepository = (db: Database): ArtifactRepository => ({
  async create(artifact) {
    const id = randomUUID()
    const [row] = await db
      .insert(artifacts)
      .values({
        id,
        userId: artifact.userId,
        rootId: artifact.rootId ?? id,
        kind: artifact.kind,
        period: artifact.period,
        rangeFrom: artifact.from,
        rangeTo: artifact.to,
        timezone: artifact.timezone,
        providers: artifact.providers,
        payload: artifact.payload,
      })
      .returning()
    return toArtifact(requireRow(row))
  },

  async findById(id) {
    const [row] = await db.select().from(artifacts).where(eq(artifacts.id, id)).limit(1)
    return row ? toArtifact(row) : null
  },

  async listLatestByUser(filters) {
    const conditions = [eq(artifacts.userId, filters.userId)]
    if (filters.kind) {
      conditions.push(eq(artifacts.kind, filters.kind))
    }

    const latest = db
      .selectDistinctOn([artifacts.rootId])
      .from(artifacts)
      .where(and(...conditions))
      .orderBy(artifacts.rootId, desc(artifacts.generatedAt), desc(artifacts.id))
      .as('latest')

    const paged = [
      filters.cursor
        ? sql`(${latest.generatedAt}, ${latest.id}) < (${filters.cursor.generatedAt}, ${filters.cursor.id}::uuid)`
        : undefined,
    ].filter((condition) => condition !== undefined)

    const rows = await db
      .select()
      .from(latest)
      .where(paged.length > 0 ? and(...paged) : undefined)
      .orderBy(desc(latest.generatedAt), desc(latest.id))
      .limit(filters.limit)

    return rows.map(toArtifact)
  },

  async listVersions(rootId) {
    const rows = await db
      .select({ id: artifacts.id, generatedAt: artifacts.generatedAt })
      .from(artifacts)
      .where(eq(artifacts.rootId, rootId))
      .orderBy(desc(artifacts.generatedAt), desc(artifacts.id))

    return rows
  },
})
