import type { ArtifactPeriod } from '../../schemas/journalSchema'


type PeriodOption = {
  value: ArtifactPeriod
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
