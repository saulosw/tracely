import { PageContainer } from '@/shared/components/PageContainer'
import { PageHeader } from '@/shared/components/PageHeader'
import { InsightsForm } from '../../components/InsightsForm'


export function InsightsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Gerar insights"
        subtitle="Escolha o período, as fontes e o que você quer ver medido — devolvemos os números e os padrões por trás deles."
      />

      <InsightsForm />
    </PageContainer>
  )
}
