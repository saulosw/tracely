import { PageContainer } from '@/shared/components/PageContainer'
import { PageHeader } from '@/shared/components/PageHeader'
import { StatusPill } from '@/shared/components/StatusPill'
import { ComingRoot, ComingText } from './styles'


export function SchedulesPage() {
  return (
    <PageContainer align="top">
      <PageHeader
        title="Agendamentos"
        subtitle="Deixe o Tracely gerar seus artefatos sozinho, no ritmo que você escolher."
      />

      <ComingRoot>
        <StatusPill tone="muted">Em breve</StatusPill>

        <ComingText variant="body2">
          Toda segunda-feira, todo fim de mês, toda virada de ano — em vez de você lembrar de
          gerar, o artefato já estará esperando. Ainda estamos construindo isso.
        </ComingText>
      </ComingRoot>
    </PageContainer>
  )
}
