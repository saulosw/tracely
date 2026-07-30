import { useState } from 'react'

import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { FormAlert } from '@/shared/components/FormAlert'
import { SourceGlyph } from '@/shared/components/SourceGlyph'
import { useConnections } from '../../hooks/useConnections'
import { describeConnectionError } from '../../services/connectionErrors'
import {
  Account,
  ActionButton,
  Actions,
  CardHead,
  CardRoot,
  ConnectButton,
  ConnectNote,
  Description,
  Detail,
  DetailText,
  ErrorSlot,
  GlyphBox,
  Headline,
  Name,
  StaleNote,
} from './styles'

import type { ConnectionSource, Provider } from '../../types'


type ConnectionCardProps = {
  source: ConnectionSource
}

export function ConnectionCard({ source }: ConnectionCardProps) {
  const { connect, disconnect } = useConnections()
  const [expanded, setExpanded] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const available = source.state !== 'unavailable'
  const connected = source.state === 'connected'
  const stale = connected && source.connection?.status !== 'ACTIVE'

  const run = async (action: () => Promise<void>) => {
    setBusy(true)
    setError(null)
    try {
      await action()
    } catch (failure) {
      setError(describeConnectionError(failure))
    } finally {
      setBusy(false)
    }
  }

  const handleConnect = (provider: Provider) => {
    void run(() => connect(provider))
  }

  const handleDisconnect = async (connectionId: string) => {
    await run(() => disconnect(connectionId))
    setConfirming(false)
  }


  return (
    <CardRoot component="article" available={available} connected={connected}>
      <CardHead>
        <GlyphBox available={available} connected={connected}>
          <SourceGlyph source={source.id} label={source.name} />
        </GlyphBox>

        <Headline>
          <Name variant="sectionTitle" available={available}>
            {source.name}
          </Name>
          <Description variant="body2">{source.description}</Description>
          {source.connection ? (
            <Account variant="meta">@{source.connection.accountLogin}</Account>
          ) : null}
        </Headline>

        <Actions>
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

          {connected && !stale ? (
            <ConnectButton onClick={() => setConfirming(true)} disabled={busy}>
              Desconectar {source.name}
            </ConnectButton>
          ) : (
            <ConnectButton
              variant="solid"
              onClick={() => source.provider && handleConnect(source.provider)}
              loading={busy}
            >
              {stale ? 'Reconectar' : 'Conectar'} {source.name}
            </ConnectButton>
          )}

          {stale ? (
            <StaleNote variant="fine">
              A autorização do {source.name} não vale mais. Reconecte para voltarmos a ler sua
              atividade.
            </StaleNote>
          ) : (
            <ConnectNote variant="fine">
              {connected
                ? `Desconectar apaga o acesso que guardamos e revoga a autorização no ${source.name}.`
                : `Você autoriza no ${source.name} e volta para cá — nada é escrito nos seus repositórios.`}
            </ConnectNote>
          )}

          {error ? (
            <ErrorSlot>
              <FormAlert>{error}</FormAlert>
            </ErrorSlot>
          ) : null}
        </Detail>
      ) : null}

      <ConfirmDialog
        open={confirming}
        title={`Desconectar ${source.name}?`}
        description={`Vamos apagar o acesso guardado e revogar a autorização no ${source.name}. Sua história já gerada continua aqui, mas paramos de ler novas atividades até você reconectar.`}
        confirmLabel="Desconectar"
        loading={busy}
        onConfirm={() => source.connection && void handleDisconnect(source.connection.id)}
        onClose={() => setConfirming(false)}
      />
    </CardRoot>
  )
}
