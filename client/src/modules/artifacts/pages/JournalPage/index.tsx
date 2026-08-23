import { PageContainer } from '@/shared/components/PageContainer'
import { PageHeader } from '@/shared/components/PageHeader'
import { JournalForm } from '../../components/JournalForm'


export function JournalPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Gerar diário"
        subtitle="Escolha o período e as fontes — devolvemos, em ordem, o que você fez nesses dias."
      />

      <JournalForm />
    </PageContainer>
  )
}
