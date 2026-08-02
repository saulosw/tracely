import type { IconName } from '@/shared/components/Icon'


export type NavItemDefinition = {
  to: string
  label: string
  icon: IconName
  disabled?: boolean
}

export const navItems: NavItemDefinition[] = [
  { to: '/dashboard', label: 'Início', icon: 'home' },
  { to: '/connect', label: 'Conexões', icon: 'connections' },
  { to: '/artifacts', label: 'Artefatos', icon: 'artifacts' },
  { to: '/schedules', label: 'Agendamentos', icon: 'schedules', disabled: true },
  { to: '/history', label: 'Histórico', icon: 'history' },
]
