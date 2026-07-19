import { Logo } from '@/shared/components/Logo'
import { NavItem } from './NavItem'
import { navItems } from './navItems'
import {
  Account,
  Avatar,
  Brand,
  Footer,
  Nav,
  NewChapterButton,
  SidebarRoot,
} from './styles'


export function Sidebar() {
  return (
    <SidebarRoot component="aside">
      <Brand>
        <Logo size="compact" />
      </Brand>

      <Nav component="nav">
        {navItems.map((item) => (
          <NavItem key={item.to} to={item.to} label={item.label} />
        ))}
      </Nav>

      <NewChapterButton variant="solid" fullWidth>
        + Novo capítulo
      </NewChapterButton>

      <Footer>
        <Account>
          <Avatar aria-hidden />
        </Account>
      </Footer>
    </SidebarRoot>
  )
}
