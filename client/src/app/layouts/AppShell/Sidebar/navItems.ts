import type { IconName } from '@/shared/components/Icon'


export type NavChildDefinition = {
  to: string
  label: string
  end?: boolean
}

export type NavLeafDefinition = {
  to: string
  label: string
  icon: IconName
  disabled?: boolean
}

export type NavGroupDefinition = {
  label: string
  icon: IconName
  children: NavChildDefinition[]
}

export type NavItemDefinition = NavLeafDefinition | NavGroupDefinition

export const navItems: NavItemDefinition[] = [
  { to: '/dashboard', label: 'Início', icon: 'home' },
  { to: '/connect', label: 'Conexões', icon: 'connections' },
  {
    label: 'Artefatos',
    icon: 'artifacts',
    children: [
      { to: '/artifacts', label: 'Artefatos', end: true },
      { to: '/artifacts/library', label: 'Meus artefatos' },
    ],
  },
  { to: '/schedules', label: 'Agendamentos', icon: 'schedules', disabled: true },
]
