export type ZonedDay = { year: number; month: number; day: number }

export type ZonedStamp = ZonedDay & { hour: number }

const MS_PER_DAY = 86_400_000

const formatters = new Map<string, Intl.DateTimeFormat>()

const formatterFor = (timeZone: string): Intl.DateTimeFormat => {
  const cached = formatters.get(timeZone)
  if (cached) {
    return cached
  }
  const created = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  formatters.set(timeZone, created)
  return created
}

const partValue = (parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): number =>
  Number(parts.find((part) => part.type === type)?.value)

const zoneOffsetMs = (instant: Date, timeZone: string): number => {
  const parts = formatterFor(timeZone).formatToParts(instant)
  const wallClock = Date.UTC(
    partValue(parts, 'year'),
    partValue(parts, 'month') - 1,
    partValue(parts, 'day'),
    partValue(parts, 'hour'),
    partValue(parts, 'minute'),
    partValue(parts, 'second'),
  )
  return wallClock - Math.floor(instant.getTime() / 1000) * 1000
}

const fromZonedClock = (
  day: ZonedDay,
  timeZone: string,
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
): Date => {
  const wallClock = Date.UTC(day.year, day.month - 1, day.day, hour, minute, second, millisecond)
  const guess = new Date(wallClock - zoneOffsetMs(new Date(wallClock), timeZone))
  return new Date(wallClock - zoneOffsetMs(guess, timeZone))
}

export const isKnownTimezone = (timeZone: string): boolean => {
  try {
    return Boolean(Intl.DateTimeFormat('en-US', { timeZone }))
  } catch {
    return false
  }
}

export const zonedStampOf = (instant: Date, timeZone: string): ZonedStamp => {
  const parts = formatterFor(timeZone).formatToParts(instant)
  return {
    year: partValue(parts, 'year'),
    month: partValue(parts, 'month'),
    day: partValue(parts, 'day'),
    hour: partValue(parts, 'hour'),
  }
}

export const startOfZonedDay = (day: ZonedDay, timeZone: string): Date =>
  fromZonedClock(day, timeZone, 0, 0, 0, 0)

export const endOfZonedDay = (day: ZonedDay, timeZone: string): Date =>
  fromZonedClock(day, timeZone, 23, 59, 59, 999)

export const shiftZonedDay = (day: ZonedDay, days: number): ZonedDay => {
  const shifted = new Date(Date.UTC(day.year, day.month - 1, day.day + days))
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  }
}

export const zonedWeekday = (day: ZonedDay): number =>
  new Date(Date.UTC(day.year, day.month - 1, day.day)).getUTCDay()

export const zonedDayKey = (day: ZonedDay): string =>
  [
    String(day.year).padStart(4, '0'),
    String(day.month).padStart(2, '0'),
    String(day.day).padStart(2, '0'),
  ].join('-')

export const daysBetween = (from: ZonedDay, to: ZonedDay): number =>
  (Date.UTC(to.year, to.month - 1, to.day) - Date.UTC(from.year, from.month - 1, from.day)) /
  MS_PER_DAY

export const parseDayKey = (value: string): ZonedDay | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) {
    return null
  }
  const day = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) }
  return zonedDayKey(shiftZonedDay(day, 0)) === value ? day : null
}
