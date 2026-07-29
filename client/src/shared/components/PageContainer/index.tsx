import { Content, Viewport } from './styles'

import type { ReactNode } from 'react'
import type { PageAlign } from './styles'


type PageContainerProps = {
  children?: ReactNode
  maxWidth?: number
  align?: PageAlign
}

export function PageContainer({ children, maxWidth = 900, align = 'center' }: PageContainerProps) {
  return (
    <Viewport>
      <Content maxWidth={maxWidth} align={align}>
        {children}
      </Content>
    </Viewport>
  )
}
