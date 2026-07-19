export type NavItemDefinition = {
  to: string
  label: string
}

export const navItems: NavItemDefinition[] = [
  { to: '/dashboard', label: 'Painel' },
  { to: '/connect', label: 'Conectar' },
  { to: '/generate', label: 'Gerar' },
  { to: '/history', label: 'Histórico' },
]
