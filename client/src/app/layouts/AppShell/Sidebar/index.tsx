import { Link } from 'react-router'

import { useAuth } from '@/modules/auth'
import { Logo } from '@/shared/components/Logo'
import { NavItem } from './NavItem'
import { navItems } from './navItems'
import { UserMenu } from './UserMenu'
import { Brand, Footer, Nav, NewArtifactButton, SidebarRoot } from './styles'


export function Sidebar() {
  const { user } = useAuth()


  return (
    <SidebarRoot component="aside">
      <Brand>
        <Logo size="compact" />
      </Brand>

      <Nav component="nav">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            disabled={item.disabled}
          />
        ))}
      </Nav>

      <NewArtifactButton component={Link} to="/artifacts" variant="solid" fullWidth>
        + Novo artefato
      </NewArtifactButton>

      <Footer>{user ? <UserMenu user={user} /> : null}</Footer>
    </SidebarRoot>
  )
}
