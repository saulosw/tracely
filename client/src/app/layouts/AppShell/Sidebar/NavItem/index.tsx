import ListItem from '@mui/material/ListItem'
import { NavLink } from 'react-router'

import { Icon } from '@/shared/components/Icon'
import { NavGlyph, NavItemRoot, NavLabel } from './styles'

import type { IconName } from '@/shared/components/Icon'


type NavItemProps = {
  to: string
  label: string
  icon: IconName
  disabled?: boolean
}

export function NavItem({ to, label, icon, disabled = false }: NavItemProps) {
  const routing = disabled ? {} : { component: NavLink, to }

  return (
    <ListItem disablePadding>
      <NavItemRoot {...routing} disabled={disabled} disableRipple>
        <NavGlyph>
          <Icon name={icon} />
        </NavGlyph>
        <NavLabel primary={label} />
      </NavItemRoot>
    </ListItem>
  )
}
