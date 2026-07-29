import { PageContainer } from '@/shared/components/PageContainer'
import { PageHeader } from '@/shared/components/PageHeader'
import { HistoryEmpty } from '../../components/HistoryEmpty'


export function HistoryPage() {
  return (
    <PageContainer align="top">
      <PageHeader
        title="Histórico"
        subtitle="Todos os capítulos que você gerou, do mais recente ao mais antigo."
      />

      <HistoryEmpty />
    </PageContainer>
  )
}
