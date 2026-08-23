const UTC = 'UTC'

const dayFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeZone: UTC })

const longDayFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: UTC })

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', timeZone: UTC })

const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: UTC })

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1)

const strip = (value: string): string => value.replace('.', '')

export type MonthCursor = {
  year: number
  month: number
}

export const monthLabels: string[] = Array.from({ length: 12 }, (_, month) =>
  capitalize(monthFormatter.format(new Date(Date.UTC(2024, month, 1)))),
)

export const weekdayLabels: string[] = Array.from({ length: 7 }, (_, weekday) =>
  capitalize(strip(weekdayFormatter.format(new Date(Date.UTC(2024, 0, 7 + weekday))))),
)

export const toDayKey = (date: Date): string => date.toISOString().slice(0, 10)

export const parseDayKey = (key: string): Date => new Date(`${key}T00:00:00Z`)

export const todayKey = (): string => toDayKey(new Date())

export const addDays = (key: string, days: number): string => {
  const date = parseDayKey(key)
  date.setUTCDate(date.getUTCDate() + days)
  return toDayKey(date)
}

export const dayNumber = (key: string): number => parseDayKey(key).getUTCDate()

export const formatDay = (key: string): string => dayFormatter.format(parseDayKey(key))

export const describeDay = (key: string): string => longDayFormatter.format(parseDayKey(key))

export const cursorOf = (key: string): MonthCursor => {
  const date = parseDayKey(key)
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() }
}

export const shiftMonth = (cursor: MonthCursor, months: number): MonthCursor => {
  const date = new Date(Date.UTC(cursor.year, cursor.month + months, 1))
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() }
}

export const monthDays = ({ year, month }: MonthCursor): (string | null)[] => {
  const lead = new Date(Date.UTC(year, month, 1)).getUTCDay()
  const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const cells: (string | null)[] = Array.from({ length: lead }, () => null)

  for (let day = 1; day <= total; day += 1) {
    cells.push(toDayKey(new Date(Date.UTC(year, month, day))))
  }

  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  return cells
}
