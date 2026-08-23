import { z } from 'zod'


export const artifactPeriods = ['yesterday', 'today', 'week', 'month', 'year', 'custom'] as const

export type ArtifactPeriod = (typeof artifactPeriods)[number]

export const MAX_RANGE_DAYS = 31

const MS_PER_DAY = 86_400_000

const isCustom = (period: ArtifactPeriod) => period === 'custom'

const withinRange = (from: string, to: string) =>
  (Date.parse(to) - Date.parse(from)) / MS_PER_DAY <= MAX_RANGE_DAYS

export const journalSchema = z
  .object({
    period: z.enum(artifactPeriods),
    from: z.string(),
    to: z.string(),
    sources: z.array(z.string()).min(1, 'Escolha ao menos uma fonte.'),
  })
  .refine((values) => !isCustom(values.period) || values.from !== '', {
    path: ['from'],
    message: 'Informe a data inicial.',
  })
  .refine((values) => !isCustom(values.period) || values.to !== '', {
    path: ['to'],
    message: 'Informe a data final.',
  })
  .refine(
    (values) =>
      !isCustom(values.period) ||
      values.from === '' ||
      values.to === '' ||
      values.from <= values.to,
    { path: ['to'], message: 'A data final precisa vir depois da inicial.' },
  )
  .refine(
    (values) =>
      !isCustom(values.period) ||
      values.from === '' ||
      values.to === '' ||
      values.from > values.to ||
      withinRange(values.from, values.to),
    { path: ['to'], message: 'O intervalo personalizado não pode passar de 31 dias.' },
  )

export type JournalFormValues = z.infer<typeof journalSchema>
