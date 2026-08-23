import { HeaderRoot, Subtitle, Title, TitleRow } from './styles'

import type { ReactNode } from 'react'


type PageHeaderProps = {
  title: string
  subtitle: string
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <HeaderRoot component="header">
      <TitleRow>
        <Title variant="pageTitle">{title}</Title>
        {action}
      </TitleRow>
      <Subtitle variant="lead">{subtitle}</Subtitle>
    </HeaderRoot>
  )
}
