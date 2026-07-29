import { PageContainer } from '@/shared/components/PageContainer'
import { PageHeader } from '@/shared/components/PageHeader'
import { ConnectionCard } from '../../components/ConnectionCard'
import { UpcomingSources } from '../../components/UpcomingSources'
import { useConnectionSources } from '../../hooks/useConnectionSources'
import { Cards } from './styles'


export function ConnectionsPage() {
  const sources = useConnectionSources()


  return (
    <PageContainer>
      <PageHeader
        title="Suas conexões"
        subtitle="Cada fonte que você conecta vira mais um fio da história. Comece pelo GitHub — Jira e Obsidian entram nos próximos capítulos."
      />

      <Cards>
        {sources.map((source) => (
          <ConnectionCard key={source.id} source={source} />
        ))}
      </Cards>

      <UpcomingSources />
    </PageContainer>
  )
}
