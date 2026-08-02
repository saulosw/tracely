import { PageContainer } from '@/shared/components/PageContainer'
import { PageHeader } from '@/shared/components/PageHeader'
import { artifacts } from '../../artifacts'
import { ArtifactCard } from '../../components/ArtifactCard'
import { ArtifactGrid } from './styles'


export function ArtifactsPage() {
  return (
    <PageContainer align="top">
      <PageHeader
        title="O que você deseja gerar?"
        subtitle="Escolha o artefato que você quer tirar da sua atividade — cada um lê os mesmos dados de um jeito diferente."
      />

      <ArtifactGrid>
        {artifacts.map((artifact) => (
          <ArtifactCard key={artifact.id} artifact={artifact} />
        ))}
      </ArtifactGrid>
    </PageContainer>
  )
}
