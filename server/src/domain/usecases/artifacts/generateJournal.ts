import { ValidationError } from '../../errors/index.js'
import { buildJournal } from './buildJournal.js'
import { resolvePeriod } from './resolvePeriod.js'

import type {
  ActivityWithProject,
  Artifact,
  ArtifactPeriod,
  Provider,
} from '../../entities/index.js'
import type { ActivityRepository, ArtifactRepository } from '../../repositories/index.js'


const PAGE_SIZE = 500
const MAX_ACTIVITIES = 20_000

export type GenerateJournalInput = {
  userId: string
  period: ArtifactPeriod
  timezone: string
  from?: string | null
  to?: string | null
  providers: Provider[]
  rootId?: string | null
}

export type GenerateJournal = (input: GenerateJournalInput) => Promise<Artifact>

export const makeGenerateJournal = (deps: {
  activityRepository: ActivityRepository
  artifactRepository: ArtifactRepository
}): GenerateJournal => {
  return async (input) => {
    const providers = [...new Set(input.providers)]
    if (providers.length === 0) {
      throw new ValidationError('Invalid journal request', { providers: 'Pick at least one source' })
    }

    const range = resolvePeriod({
      period: input.period,
      timezone: input.timezone,
      from: input.from ?? null,
      to: input.to ?? null,
      now: new Date(),
    })

    const activities: ActivityWithProject[] = []
    let cursor: { occurredAt: Date; id: string } | undefined
    let truncated = false
    for (;;) {
      const page: ActivityWithProject[] = await deps.activityRepository.listByUserAndRange({
        userId: input.userId,
        from: range.from,
        to: range.to,
        providers,
        limit: PAGE_SIZE,
        ...(cursor ? { cursor } : {}),
      })
      activities.push(...page)

      const last = page[page.length - 1]
      if (page.length < PAGE_SIZE || !last) {
        break
      }
      if (activities.length >= MAX_ACTIVITIES) {
        truncated = true
        break
      }
      cursor = { occurredAt: last.occurredAt, id: last.id }
    }

    const payload = buildJournal({
      activities,
      from: range.from,
      to: range.to,
      timezone: input.timezone,
      truncated,
    })

    return deps.artifactRepository.create({
      userId: input.userId,
      rootId: input.rootId ?? null,
      kind: 'journal',
      period: input.period,
      from: range.from,
      to: range.to,
      timezone: input.timezone,
      providers,
      payload,
    })
  }
}
