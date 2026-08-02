import { z } from 'zod'


export const insightPeriods = ['yesterday', 'today', 'week', 'month', 'year', 'custom'] as const

export type InsightPeriod = (typeof insightPeriods)[number]

export const insightCategories = [
  'commits',
  'repositories',
  'pull-requests',
  'branches',
  'lines-added',
  'lines-removed',
  'files-changed',
] as const

export type InsightCategory = (typeof insightCategories)[number]

const isCustom = (period: InsightPeriod) => period === 'custom'

const withinOneMonth = (from: string, to: string) => {
  const limit = new Date(from)
  limit.setUTCMonth(limit.getUTCMonth() + 1)
  return new Date(to) <= limit
}

export const insightsSchema = z
  .object({
    period: z.enum(insightPeriods),
    from: z.string(),
    to: z.string(),
    sources: z.array(z.string()).min(1, 'Escolha ao menos uma fonte.'),
    categories: z.array(z.enum(insightCategories)).min(1, 'Escolha ao menos uma categoria.'),
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
      !isCustom(values.period) || values.from === '' || values.to === '' || values.from <= values.to,
    {
      path: ['to'],
      message: 'A data final precisa vir depois da inicial.',
    },
  )
  .refine(
    (values) =>
      !isCustom(values.period) ||
      values.from === '' ||
      values.to === '' ||
      values.from > values.to ||
      withinOneMonth(values.from, values.to),
    {
      path: ['to'],
      message: 'O intervalo personalizado não pode passar de um mês.',
    },
  )

export type InsightsFormValues = z.infer<typeof insightsSchema>
