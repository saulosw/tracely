import { HeaderRoot, Subtitle, Title } from './styles'


type PageHeaderProps = {
  title: string
  subtitle: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <HeaderRoot component="header">
      <Title variant="pageTitle">{title}</Title>
      <Subtitle variant="lead">{subtitle}</Subtitle>
    </HeaderRoot>
  )
}
