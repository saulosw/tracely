import { describe, expect, it } from 'vitest'

import { journalSchema } from './journalSchema'


const values = (from: string, to: string) => ({
  period: 'custom' as const,
  from,
  to,
  sources: ['github'],
})

const messages = (from: string, to: string): string[] => {
  const result = journalSchema.safeParse(values(from, to))
  return result.success ? [] : result.error.issues.map((issue) => issue.message)
}

describe('journalSchema', () => {
  it('takes a custom range inside the limit', () => {
    expect(messages('2026-01-01', '2026-01-31')).toEqual([])
  })

  it('refuses a custom range longer than the limit', () => {
    expect(messages('2026-01-01', '2026-03-01')).toContain(
      'O intervalo personalizado não pode passar de 31 dias.',
    )
  })

  it('refuses an end date that comes before the start', () => {
    expect(messages('2026-01-31', '2026-01-01')).toContain(
      'A data final precisa vir depois da inicial.',
    )
  })

  it('asks for both ends of a custom period', () => {
    expect(messages('', '')).toEqual(
      expect.arrayContaining(['Informe a data inicial.', 'Informe a data final.']),
    )
  })
})
