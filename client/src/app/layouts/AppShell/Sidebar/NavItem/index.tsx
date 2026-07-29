import ListItem from '@mui/material/ListItem'
import { NavLink } from 'react-router'

import { Icon } from '@/shared/components/Icon'
import { NavGlyph, NavItemRoot, NavLabel } from './styles'

import type { IconName } from '@/shared/components/Icon'


type NavItemProps = {
  to: string
  label: string
  icon: IconName
}

export function NavItem({ to, label, icon }: NavItemProps) {
  return (
    <ListItem disablePadding>
      <NavItemRoot component={NavLink} to={to} disableRipple>
        <NavGlyph>
          <Icon name={icon} />
        </NavGlyph>
        <NavLabel primary={label} />
      </NavItemRoot>
    </ListItem>
  )
}
