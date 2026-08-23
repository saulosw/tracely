import { ValidationError } from '../../errors/index.js'
import { isUuid } from './uuid.js'

import type { Artifact, ArtifactKind } from '../../entities/index.js'
import type { ArtifactRepository } from '../../repositories/index.js'


const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 50

export type ListArtifactsInput = {
  userId: string
  kind?: ArtifactKind | null
  first?: number
  after?: string | null
}

export type ArtifactPage = {
  items: Artifact[]
  nextCursor: string | null
}

export type ListArtifacts = (input: ListArtifactsInput) => Promise<ArtifactPage>

const encodeCursor = (generatedAt: Date, id: string): string =>
  Buffer.from(`${generatedAt.toISOString()}|${id}`).toString('base64url')

const decodeCursor = (cursor: string): { generatedAt: Date; id: string } => {
  const decoded = Buffer.from(cursor, 'base64url').toString('utf8')
  const separator = decoded.indexOf('|')
  const generatedAt = new Date(decoded.slice(0, separator))
  const id = decoded.slice(separator + 1)
  if (separator === -1 || Number.isNaN(generatedAt.getTime()) || !isUuid(id)) {
    throw new ValidationError('Invalid pagination cursor', { after: 'Cursor is malformed' })
  }
  return { generatedAt, id }
}

export const makeListArtifacts = (deps: {
  artifactRepository: ArtifactRepository
}): ListArtifacts => {
  return async (input) => {
    const first = input.first ?? DEFAULT_PAGE_SIZE
    if (first < 1 || first > MAX_PAGE_SIZE) {
      throw new ValidationError('Invalid page size', {
        first: `Must be between 1 and ${MAX_PAGE_SIZE}`,
      })
    }

    const items = await deps.artifactRepository.listLatestByUser({
      userId: input.userId,
      limit: first + 1,
      ...(input.kind ? { kind: input.kind } : {}),
      ...(input.after ? { cursor: decodeCursor(input.after) } : {}),
    })

    const hasNextPage = items.length > first
    const page = hasNextPage ? items.slice(0, first) : items
    const last = page[page.length - 1]

    return {
      items: page,
      nextCursor: hasNextPage && last ? encodeCursor(last.generatedAt, last.id) : null,
    }
  }
}
