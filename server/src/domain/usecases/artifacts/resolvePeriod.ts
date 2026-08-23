import { ValidationError } from '../../errors/index.js'
import {
  daysBetween,
  endOfZonedDay,
  isKnownTimezone,
  parseDayKey,
  shiftZonedDay,
  startOfZonedDay,
  zonedStampOf,
  zonedWeekday,
} from './zonedTime.js'

import type { ArtifactPeriod } from '../../entities/index.js'
import type { ZonedDay } from './zonedTime.js'


const MAX_RANGE_DAYS = 31

export type ResolvePeriodInput = {
  period: ArtifactPeriod
  timezone: string
  from?: string | null
  to?: string | null
  now: Date
}

export type ResolvedPeriod = {
  from: Date
  to: Date
}

const startOfNamedPeriod = (period: ArtifactPeriod, today: ZonedDay): ZonedDay => {
  if (period === 'week') {
    return shiftZonedDay(today, -((zonedWeekday(today) + 6) % 7))
  }
  if (period === 'month') {
    return { year: today.year, month: today.month, day: 1 }
  }
  return today
}

const resolveCustomRange = (input: ResolvePeriodInput): ResolvedPeriod => {
  const from = input.from ? parseDayKey(input.from) : null
  if (!from) {
    throw new ValidationError('Invalid custom range', { from: 'Expected a YYYY-MM-DD date' })
  }
  const to = input.to ? parseDayKey(input.to) : null
  if (!to) {
    throw new ValidationError('Invalid custom range', { to: 'Expected a YYYY-MM-DD date' })
  }

  const span = daysBetween(from, to)
  if (span < 0) {
    throw new ValidationError('Invalid custom range', { to: 'Must not be before "from"' })
  }
  if (span > MAX_RANGE_DAYS) {
    throw new ValidationError('Invalid custom range', {
      to: `A custom range cannot span more than ${MAX_RANGE_DAYS} days`,
    })
  }

  return {
    from: startOfZonedDay(from, input.timezone),
    to: endOfZonedDay(to, input.timezone),
  }
}

export const resolvePeriod = (input: ResolvePeriodInput): ResolvedPeriod => {
  if (input.period === 'year') {
    throw new ValidationError('The whole year is a Tracely Pro period', {
      period: 'Not available on this plan',
    })
  }
  if (!isKnownTimezone(input.timezone)) {
    throw new ValidationError('Invalid time zone', { timezone: 'Not a known IANA time zone' })
  }

  if (input.period === 'custom') {
    return resolveCustomRange(input)
  }

  const today = zonedStampOf(input.now, input.timezone)
  if (input.period === 'yesterday') {
    const yesterday = shiftZonedDay(today, -1)
    return {
      from: startOfZonedDay(yesterday, input.timezone),
      to: endOfZonedDay(yesterday, input.timezone),
    }
  }

  return {
    from: startOfZonedDay(startOfNamedPeriod(input.period, today), input.timezone),
    to: input.now,
  }
}
