const numberFormatter = new Intl.NumberFormat('pt-BR')

const dayFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

const shortDayFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  timeZone: 'UTC',
})

const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  timeZone: 'UTC',
})

const rangeFormatterFor = (timeZone: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone })

const stampFormatterFor = (timeZone: string) =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone })

const timeFormatterFor = (timeZone: string) =>
  new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone })

const dayOf = (key: string): Date => new Date(`${key}T00:00:00Z`)

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1)

const isWeekend = (key: string): boolean => [0, 6].includes(dayOf(key).getUTCDay())

const daysBetween = (from: string, to: string): number =>
  Math.round((dayOf(to).getTime() - dayOf(from).getTime()) / 86_400_000)

export const formatNumber = (value: number): string => numberFormatter.format(value)

export const formatDayKey = (key: string): string => dayFormatter.format(dayOf(key))

export const formatRange = (from: string, to: string, timeZone: string): string => {
  const formatter = rangeFormatterFor(timeZone)
  const start = formatter.format(new Date(from))
  const end = formatter.format(new Date(to))
  return start === end ? start : `${start} — ${end}`
}

export const formatStamp = (iso: string, timeZone: string): string =>
  stampFormatterFor(timeZone).format(new Date(iso))

export const formatTime = (iso: string, timeZone: string): string =>
  timeFormatterFor(timeZone).format(new Date(iso))

export const formatSectionDate = (from: string, to: string): string =>
  from === to ? formatDayKey(from) : `${shortDayFormatter.format(dayOf(from))} — ${shortDayFormatter.format(dayOf(to))}`

export const formatSectionSpan = (from: string, to: string): string => {
  if (from === to) {
    return capitalize(weekdayFormatter.format(dayOf(from)))
  }
  if (isWeekend(from) && isWeekend(to)) {
    return 'Fim de semana'
  }
  return `${daysBetween(from, to) + 1} dias`
}
