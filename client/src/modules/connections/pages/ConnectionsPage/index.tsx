import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { FormAlert } from '@/shared/components/FormAlert'
import { PageContainer } from '@/shared/components/PageContainer'
import { PageHeader } from '@/shared/components/PageHeader'
import { ConnectionCard } from '../../components/ConnectionCard'
import { UpcomingSources } from '../../components/UpcomingSources'
import { useConnectionSources } from '../../hooks/useConnectionSources'
import { describeCallbackError } from '../../services/connectionErrors'
import { Alert, Cards } from './styles'


export function ConnectionsPage() {
  const sources = useConnectionSources()
  const [searchParams, setSearchParams] = useSearchParams()
  const [callbackError, setCallbackError] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get('error')
    if (!code && !searchParams.has('connected')) {
      return
    }
    if (code) {
      setCallbackError(describeCallbackError(code))
    }
    const next = new URLSearchParams(searchParams)
    next.delete('error')
    next.delete('connected')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])


  return (
    <PageContainer>
      <PageHeader
        title="Suas conexões"
        subtitle="Cada fonte que você conecta vira mais um fio da história. Comece pelo GitHub — Jira e Obsidian entram nos próximos capítulos."
      />

      {callbackError ? (
        <Alert>
          <FormAlert>{callbackError}</FormAlert>
        </Alert>
      ) : null}

      <Cards>
        {sources.map((source) => (
          <ConnectionCard key={source.id} source={source} />
        ))}
      </Cards>

      <UpcomingSources />
    </PageContainer>
  )
}
