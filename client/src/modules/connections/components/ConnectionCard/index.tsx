import { useState } from 'react'

import { SourceGlyph } from '@/shared/components/SourceGlyph'
import { StatusPill } from '@/shared/components/StatusPill'
import {
  ActionButton,
  Actions,
  CardHead,
  CardRoot,
  ConnectButton,
  ConnectNote,
  Description,
  Detail,
  DetailText,
  GlyphBox,
  Headline,
  Name,
} from './styles'

import type { ConnectionSource, ConnectionState } from '../../types'


const stateLabel: Record<ConnectionState, string> = {
  connected: 'Conectado',
  disconnected: 'Não conectado',
  unavailable: 'Em breve',
}

type ConnectionCardProps = {
  source: ConnectionSource
}

export function ConnectionCard({ source }: ConnectionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const available = source.state !== 'unavailable'


  return (
    <CardRoot component="article" available={available}>
      <CardHead>
        <GlyphBox available={available}>
          <SourceGlyph source={source.id} label={source.name} />
        </GlyphBox>

        <Headline>
          <Name variant="sectionTitle" available={available}>
            {source.name}
          </Name>
          <Description variant="body2">{source.description}</Description>
        </Headline>

        <Actions>
          <StatusPill tone={available ? 'neutral' : 'muted'}>
            {stateLabel[source.state]}
          </StatusPill>

          {available ? (
            <ActionButton onClick={() => setExpanded((open) => !open)} aria-expanded={expanded}>
              {expanded ? 'Fechar' : 'Detalhes'}
            </ActionButton>
          ) : (
            <ActionButton disabled>Detalhes</ActionButton>
          )}
        </Actions>
      </CardHead>

      {available && expanded ? (
        <Detail>
          <DetailText variant="body2">{source.detail}</DetailText>

          <ConnectButton disabled>Conectar {source.name}</ConnectButton>

          <ConnectNote variant="fine">
            A conexão com o {source.name} ainda não está disponível nesta versão.
          </ConnectNote>
        </Detail>
      ) : null}
    </CardRoot>
  )
}
