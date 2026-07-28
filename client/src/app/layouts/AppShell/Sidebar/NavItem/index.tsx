import ListItem from '@mui/material/ListItem'
import { NavLink } from 'react-router'

import { Dot, NavItemRoot, NavLabel } from './styles'


type NavItemProps = {
  to: string
  label: string
}

export function NavItem({ to, label }: NavItemProps) {
  return (
    <ListItem disablePadding>
      <NavItemRoot component={NavLink} to={to} disableRipple>
        <Dot aria-hidden />
        <NavLabel primary={label} />
      </NavItemRoot>
    </ListItem>
  )
}
