import type { IconName } from '@/shared/components/Icon'


export type NavItemDefinition = {
  to: string
  label: string
  icon: IconName
}

export const navItems: NavItemDefinition[] = [
  { to: '/dashboard', label: 'Início', icon: 'home' },
  { to: '/connect', label: 'Conexões', icon: 'connections' },
  { to: '/history', label: 'Histórico', icon: 'history' },
]
