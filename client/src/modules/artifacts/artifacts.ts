import type { IconName } from '@/shared/components/Icon'


export type ArtifactId = 'insights' | 'storytelling' | 'journal'

export type ArtifactDefinition = {
  id: ArtifactId
  name: string
  description: string
  icon: IconName
  to?: string
}

export const artifacts: ArtifactDefinition[] = [
  {
    id: 'insights',
    name: 'Insights',
    description: 'Um painel de métricas e padrões extraídos direto da sua atividade.',
    icon: 'insights',
    to: '/artifacts/insights',
  },
  {
    id: 'storytelling',
    name: 'Storytelling',
    description: 'Um relato da sua atividade em prosa — pronto para compartilhar.',
    icon: 'storytelling',
  },
  {
    id: 'journal',
    name: 'Diário',
    description: 'Um capítulo da sua trajetória, lido como um relato íntimo do seu trabalho.',
    icon: 'journal',
  },
]
