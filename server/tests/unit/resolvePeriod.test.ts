import { describe, expect, it } from 'vitest'

import { ValidationError, resolvePeriod } from '../../src/domain/index.js'


const TIMEZONE = 'America/Sao_Paulo'

const NOW = new Date('2026-08-02T15:00:00Z')

const resolve = (input: Partial<Parameters<typeof resolvePeriod>[0]> = {}) =>
  resolvePeriod({ period: 'today', timezone: TIMEZONE, now: NOW, ...input })

describe('resolvePeriod', () => {
  it('holds the whole year back as a Pro period', () => {
    expect(() => resolve({ period: 'year' })).toThrow(ValidationError)
  })

  it('refuses a time zone it does not know', () => {
    expect(() => resolve({ timezone: 'Mars/Olympus' })).toThrow(ValidationError)
  })

  it('starts today at midnight in the reader time zone, not in UTC', () => {
    const range = resolve({ period: 'today', now: new Date('2026-08-02T01:00:00Z') })

    expect(range.from.toISOString()).toBe('2026-08-01T03:00:00.000Z')
    expect(range.to.toISOString()).toBe('2026-08-02T01:00:00.000Z')
  })

  it('closes yesterday at the last millisecond of that local day', () => {
    const range = resolve({ period: 'yesterday' })

    expect(range.from.toISOString()).toBe('2026-08-01T03:00:00.000Z')
    expect(range.to.toISOString()).toBe('2026-08-02T02:59:59.999Z')
  })

  it('opens the week on the local Monday', () => {
    const range = resolve({ period: 'week' })

    expect(range.from.toISOString()).toBe('2026-07-27T03:00:00.000Z')
    expect(range.to).toEqual(NOW)
  })

  it('opens the month on its first local day', () => {
    const range = resolve({ period: 'month' })

    expect(range.from.toISOString()).toBe('2026-08-01T03:00:00.000Z')
  })

  it('spans a custom range from the first midnight to the last millisecond', () => {
    const range = resolve({ period: 'custom', from: '2026-03-01', to: '2026-03-31' })

    expect(range.from.toISOString()).toBe('2026-03-01T03:00:00.000Z')
    expect(range.to.toISOString()).toBe('2026-04-01T02:59:59.999Z')
  })

  it('refuses a custom range longer than a month', () => {
    expect(() => resolve({ period: 'custom', from: '2026-03-01', to: '2026-04-05' })).toThrow(
      ValidationError,
    )
  })

  it('refuses an inverted custom range', () => {
    expect(() => resolve({ period: 'custom', from: '2026-03-10', to: '2026-03-01' })).toThrow(
      ValidationError,
    )
  })

  it('refuses a custom range that is not a calendar date', () => {
    expect(() => resolve({ period: 'custom', from: '2026-02-31', to: '2026-03-01' })).toThrow(
      ValidationError,
    )
    expect(() => resolve({ period: 'custom', from: '', to: '2026-03-01' })).toThrow(ValidationError)
  })

  it('keeps a daylight-saving jump on the right local day', () => {
    const range = resolvePeriod({
      period: 'custom',
      timezone: 'Europe/Lisbon',
      from: '2026-03-29',
      to: '2026-03-29',
      now: NOW,
    })

    expect(range.from.toISOString()).toBe('2026-03-29T00:00:00.000Z')
    expect(range.to.toISOString()).toBe('2026-03-29T22:59:59.999Z')
  })
})
