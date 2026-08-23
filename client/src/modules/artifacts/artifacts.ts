import type { IconName } from '@/shared/components/Icon'
import type { ArtifactKind } from './types'


export type ArtifactId = 'insights' | 'journal'

export type ArtifactDefinition = {
  id: ArtifactId
  name: string
  description: string
  icon: IconName
  to?: string
}

export const artifacts: ArtifactDefinition[] = [
  {
    id: 'journal',
    name: 'Diário',
    description: 'Um capítulo da sua trajetória, lido como um relato íntimo do seu trabalho.',
    icon: 'journal',
    to: '/artifacts/journal',
  },
  {
    id: 'insights',
    name: 'Insights',
    description: 'Um painel de métricas e padrões extraídos direto da sua atividade.',
    icon: 'insights',
  },
]

export const artifactPath = (kind: ArtifactKind | null, id: string): string | null => {
  const definition = artifacts.find((artifact) => artifact.id === kind)
  return definition?.to ? `${definition.to}/${id}` : null
}
