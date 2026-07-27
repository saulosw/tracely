import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

import { Logo } from '@/shared/components/Logo'
import {
  Editorial,
  Hero,
  HeroAccent,
  HeroSub,
  MobileBrand,
  Panel,
  PanelEyebrow,
  PanelFooter,
  PanelHeader,
  PanelInner,
  PanelSubtitle,
  PanelTitle,
  Specimen,
  SpecimenDot,
  SpecimenFooter,
  SpecimenLabel,
  SpecimenMeta,
  SpecimenQuote,
  Split,
  Terms,
} from './styles'


type AuthLayoutProps = {
  eyebrow: string
  title: string
  subtitle: string
  footer: ReactNode
  children: ReactNode
}

export function AuthLayout({ eyebrow, title, subtitle, footer, children }: AuthLayoutProps) {
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
            Não é um painel. É um diário que se escreve sozinho — transformando o trabalho
            silencioso de todo dia em algo que você consegue reler depois.
          </HeroSub>
        </Hero>

        <Specimen component="figure">
          <SpecimenLabel variant="eyebrow">De um capítulo · março de 2026</SpecimenLabel>
          <SpecimenQuote variant="quote">
            &ldquo;O bug com que todo mundo já tinha aprendido a conviver não era a rede,
            afinal — éramos nós, disparando o mesmo handler duas vezes e torcendo.&rdquo;
          </SpecimenQuote>
          <SpecimenQuote variant="quote">
            &ldquo;Existe um alívio particular em descobrir que o monstro embaixo da cama é o
            seu próprio código. O seu próprio código você consegue consertar.&rdquo;
          </SpecimenQuote>
          <SpecimenFooter component="figcaption">
            <SpecimenDot aria-hidden />
            <SpecimenMeta variant="meta" component="cite">
              83 commits, 4 repositórios, um mês — contados como uma história só.
            </SpecimenMeta>
          </SpecimenFooter>
        </Specimen>
      </Editorial>

      <Panel component="main">
        <PanelInner>
          <MobileBrand>
            <Logo size="compact" />
          </MobileBrand>

          <PanelHeader>
            <PanelEyebrow variant="eyebrow">{eyebrow}</PanelEyebrow>
            <PanelTitle variant="pageTitle">{title}</PanelTitle>
            <PanelSubtitle variant="lead">{subtitle}</PanelSubtitle>
          </PanelHeader>

          {children}

          <PanelFooter>{footer}</PanelFooter>

          <Terms variant="fine">
            Ao continuar, você concorda com os Termos e a Política de Privacidade. Nós apenas
            lemos — nunca escrevemos nas suas ferramentas.
          </Terms>
        </PanelInner>
      </Panel>
    </Split>
  )
}
