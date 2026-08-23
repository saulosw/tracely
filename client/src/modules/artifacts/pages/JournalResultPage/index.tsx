import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { sourceIdOf } from '@/modules/connections'
import { FormAlert } from '@/shared/components/FormAlert'
import { Icon } from '@/shared/components/Icon'
import { PageContainer } from '@/shared/components/PageContainer'
import { ScreenLoader } from '@/shared/components/ScreenLoader'
import { SourceGlyph } from '@/shared/components/SourceGlyph'
import { ArtifactVersions } from '../../components/ArtifactVersions'
import { CopyMarkdownButton } from '../../components/CopyMarkdownButton'
import { JournalTimeline } from '../../components/JournalTimeline'
import { useArtifact } from '../../hooks/useArtifact'
import { describeArtifactError } from '../../services/artifactErrors'
import { formatNumber, formatRange, formatStamp } from '../../services/artifactFormat'
import { regenerateJournal } from '../../services/artifactsApi'
import {
  Actions,
  BackLink,
  EmptyNote,
  Eyebrow,
  Footnote,
  Head,
  Lede,
  MetaRow,
  MetaText,
  RegenerateButton,
  SourceTag,
  Timeline,
  Title,
} from './styles'

import type { Artifact } from '../../types'


const LEDE = 'Registrado automaticamente — fatos, datas e fontes. Nada escrito à mão.'

const TRUNCATED =
  'A atividade do período passou do limite de leitura, então o diário mostra parte dela.'

const countEntries = (artifact: Artifact): number =>
  artifact.journal?.sections.reduce(
    (total, section) => total + section.entries.length + section.overflow,
    0,
  ) ?? 0

export function JournalResultPage() {
  const navigate = useNavigate()
  const state = useArtifact(useParams().id)
  const [regenerating, setRegenerating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  if (state.status === 'loading') {
    return <ScreenLoader />
  }

  if (state.status === 'error') {
    return (
      <PageContainer align="top">
        <FormAlert>{state.message}</FormAlert>
      </PageContainer>
    )
  }

  const { artifact } = state
  const { journal } = artifact

  const regenerate = async () => {
    setActionError(null)
    setRegenerating(true)
    try {
      const next = await regenerateJournal(artifact.id)
      navigate(`/artifacts/journal/${next.id}`)
    } catch (error) {
      setActionError(describeArtifactError(error))
    } finally {
      setRegenerating(false)
    }
  }


  return (
    <PageContainer align="top" maxWidth={880}>
      <BackLink variant="fine" component={Link} to="/artifacts/library">
        ← Biblioteca
      </BackLink>

      <Head component="header">
        <Eyebrow variant="eyebrow">Diário</Eyebrow>
        <Title variant="pageTitle">
          {formatRange(artifact.from, artifact.to, artifact.timezone)}
        </Title>
      </Head>

      <Lede variant="lead">{LEDE}</Lede>

      <MetaRow>
        <MetaText variant="fine">
          Gerado em {formatStamp(artifact.generatedAt, artifact.timezone)}
        </MetaText>
        <MetaText variant="fine">Construído a partir de</MetaText>
        {artifact.providers.map((provider) => (
          <SourceTag key={provider} variant="eyebrow">
            <SourceGlyph source={sourceIdOf(provider)} />
            {provider}
          </SourceTag>
        ))}
      </MetaRow>

      <Timeline>
        {journal && journal.sections.length > 0 ? (
          <JournalTimeline journal={journal} timezone={artifact.timezone} />
        ) : (
          <EmptyNote variant="quote">
            Nenhuma atividade registrada nesse período. Sincronize suas fontes ou escolha outro
            intervalo.
          </EmptyNote>
        )}
      </Timeline>

      <Footnote variant="fine">
        {formatNumber(countEntries(artifact))} entradas ·{' '}
        {formatNumber(artifact.providers.length)} fontes ·{' '}
        {formatRange(artifact.from, artifact.to, artifact.timezone)}
        {journal?.truncated ? ` · ${TRUNCATED}` : ''}
      </Footnote>

      <Actions>
        <CopyMarkdownButton artifact={artifact} />
        <RegenerateButton
          onClick={regenerate}
          disabled={regenerating}
          startIcon={<Icon name="regenerate" />}
        >
          {regenerating ? 'Relendo sua atividade…' : 'Gerar novamente'}
        </RegenerateButton>
      </Actions>

      {actionError ? <FormAlert>{actionError}</FormAlert> : null}

      <ArtifactVersions
        versions={artifact.versions}
        currentId={artifact.id}
        timezone={artifact.timezone}
      />
    </PageContainer>
  )
}
