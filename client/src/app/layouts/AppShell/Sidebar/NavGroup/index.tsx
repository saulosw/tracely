import Collapse from '@mui/material/Collapse'
import ListItem from '@mui/material/ListItem'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router'

import { Icon } from '@/shared/components/Icon'
import { NavGlyph, NavItemRoot, NavLabel } from '../NavItem/styles'
import { GroupChevron, GroupLink, GroupList } from './styles'

import type { IconName } from '@/shared/components/Icon'
import type { NavChildDefinition } from '../navItems'


type NavGroupProps = {
  label: string
  icon: IconName
  items: NavChildDefinition[]
}

export function NavGroup({ label, icon, items }: NavGroupProps) {
  const { pathname } = useLocation()
  const [toggled, setToggled] = useState<boolean | null>(null)

  const holdsCurrent = items.some(
    (item) => pathname === item.to || pathname.startsWith(`${item.to}/`),
  )
  const open = toggled ?? holdsCurrent

  return (
    <>
      <ListItem disablePadding>
        <NavItemRoot
          className={holdsCurrent ? 'active' : undefined}
          onClick={() => setToggled(!open)}
          aria-expanded={open}
          disableRipple
        >
          <NavGlyph>
            <Icon name={icon} />
          </NavGlyph>
          <NavLabel primary={label} />
          <GroupChevron open={open} aria-hidden>
            <Icon name="expand" />
          </GroupChevron>
        </NavItemRoot>
      </ListItem>

      <Collapse in={open} unmountOnExit>
        <GroupList component="div" disablePadding>
          {items.map((item) => (
            <ListItem key={item.to} disablePadding>
              <GroupLink component={NavLink} to={item.to} end={item.end} disableRipple>
                {item.label}
              </GroupLink>
            </ListItem>
          ))}
        </GroupList>
      </Collapse>
    </>
  )
}
