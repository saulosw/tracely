import { PageContainer } from '@/shared/components/PageContainer'
import { PageHeader } from '@/shared/components/PageHeader'
import { GenerateForm } from '../../components/GenerateForm'


export function GeneratePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Que período vamos contar?"
        subtitle="Escolha um intervalo, leremos cada commit dele e devolvemos como uma história."
      />

      <GenerateForm />
    </PageContainer>
  )
}
