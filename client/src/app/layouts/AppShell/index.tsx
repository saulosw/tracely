import { Outlet } from 'react-router'

import { Sidebar } from './Sidebar'
import { Content, ShellRoot } from './styles'


export function AppShell() {
  return (
    <ShellRoot>
      <Sidebar />
      <Content component="main">
        <Outlet />
      </Content>
    </ShellRoot>
  )
}
