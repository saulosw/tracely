export type ContentItem = {
  title: string
  detail: string
  pro?: boolean
}

export const contentItems: ContentItem[] = [
  {
    title: 'Linha do tempo',
    detail: 'O relato dia a dia do que você fez no período.',
  },
  {
    title: 'Dados',
    detail: 'Commits, pull requests, issues e repositórios do período.',
  },
  {
    title: 'Gráficos e métricas',
    detail: 'Commits por semana, ritmo por dia da semana, onde o trabalho foi.',
  },
  {
    title: 'Narrativa escrita por IA',
    detail:
      'A versão em prosa — uma história escrita a partir da sua atividade, não só uma lista dela.',
    pro: true,
  },
]
