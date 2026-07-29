import type { GenerationPeriod } from '../../schemas/generationSchema'


type PeriodOption = {
  value: GenerationPeriod
  label: string
}

export const periodOptions: PeriodOption[] = [
  { value: 'last-chapter', label: 'Desde o último capítulo' },
  { value: 'yesterday', label: 'Ontem' },
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mês' },
  { value: 'year', label: 'Este ano' },
  { value: 'custom', label: 'Personalizado' },
]
