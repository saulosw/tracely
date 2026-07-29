import { z } from 'zod'


export const generationPeriods = [
  'last-chapter',
  'yesterday',
  'week',
  'month',
  'year',
  'custom',
] as const

export type GenerationPeriod = (typeof generationPeriods)[number]

const isCustom = (period: GenerationPeriod) => period === 'custom'

export const generationSchema = z
  .object({
    period: z.enum(generationPeriods),
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
      !isCustom(values.period) || values.from === '' || values.to === '' || values.from <= values.to,
    {
      path: ['to'],
      message: 'A data final precisa vir depois da inicial.',
    },
  )

export type GenerationFormValues = z.infer<typeof generationSchema>
