import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

import { Logo } from '@/shared/components/Logo'
import { AuthTabs } from '../AuthTabs'
import {
  ChipDot,
  Editorial,
  Hero,
  HeroAccent,
  HeroSub,
  Panel,
  PanelIntro,
  Quote,
  QuoteMeta,
  QuoteText,
  SourceChip,
  SourceChips,
  Sources,
  SourcesLabel,
  Split,
  Terms,
} from './styles'


const upcomingSources = ['GitLab', 'Jira', 'Linear', 'Figma', 'Notion', 'Obsidian']

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Split>
      <Editorial component="aside">
        <Logo size="hero" />

        <Hero>
          <Typography variant="display">
            A história que seu trabalho
            <br />
            <HeroAccent>já está contando.</HeroAccent>
          </Typography>
          <HeroSub variant="lead">
            Não é um painel. É um diário que se escreve sozinho — reunindo o que você
            constrói, decide e anota espalhado por todas as suas ferramentas, e devolvendo
            em forma de algo que você realmente consegue reler.
          </HeroSub>

          <Sources>
            <SourcesLabel variant="meta">Hoje lemos o GitHub. Em breve:</SourcesLabel>
            <SourceChips>
              <SourceChip active>
                <ChipDot aria-hidden />
                GitHub
              </SourceChip>
              {upcomingSources.map((source) => (
                <SourceChip key={source}>{source}</SourceChip>
              ))}
            </SourceChips>
          </Sources>
        </Hero>

        <Quote component="blockquote">
          <QuoteText variant="quote">
            &ldquo;Passei três semanas achando que não tinha feito nada. O Tracely me
            mostrou as decisões, os becos sem saída e a reescrita que mudou tudo — era o
            melhor mês que eu tinha tido.&rdquo;
          </QuoteText>
          <QuoteMeta variant="meta" component="cite">
            março · 4 repositórios · 12 notas · 9 tarefas
          </QuoteMeta>
        </Quote>
      </Editorial>

      <Panel component="main">
        <AuthTabs />
        <PanelIntro variant="body1">Continue de onde sua última história parou.</PanelIntro>
        {children}
        <Terms variant="fine">
          Ao continuar, você concorda com os Termos e a Política de Privacidade. Nós apenas
          lemos — nunca escrevemos nas suas ferramentas.
        </Terms>
      </Panel>
    </Split>
  )
}
