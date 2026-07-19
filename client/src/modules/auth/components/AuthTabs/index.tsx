import { Link, useLocation } from 'react-router-dom'

import { TabBar, TabItem } from './styles'


export function AuthTabs() {
  const { pathname } = useLocation()


  return (
    <TabBar value={pathname} aria-label="Entrar ou criar conta">
      <TabItem value="/login" label="Entrar" component={Link} to="/login" />
      <TabItem value="/register" label="Criar conta" component={Link} to="/register" />
    </TabBar>
  )
}
