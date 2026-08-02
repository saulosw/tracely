import type { InsightPeriod } from '../../schemas/insightsSchema'


type PeriodOption = {
  value: InsightPeriod
  label: string
  pro?: boolean
}

export const periodOptions: PeriodOption[] = [
  { value: 'yesterday', label: 'Ontem' },
  { value: 'today', label: 'Hoje' },
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mês' },
  { value: 'year', label: 'Este ano', pro: true },
  { value: 'custom', label: 'Personalizado' },
]
