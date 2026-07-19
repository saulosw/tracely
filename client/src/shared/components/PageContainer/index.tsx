import type { ReactNode } from 'react'

import { Container } from './styles'


type PageContainerProps = {
  children?: ReactNode
  maxWidth?: number
}

export function PageContainer({ children, maxWidth = 900 }: PageContainerProps) {
  return <Container maxWidth={maxWidth}>{children}</Container>
}
