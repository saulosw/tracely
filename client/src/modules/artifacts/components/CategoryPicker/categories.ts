import type { InsightCategory } from '../../schemas/insightsSchema'


type CategoryOption = {
  value: InsightCategory
  label: string
}

export const categoryOptions: CategoryOption[] = [
  { value: 'commits', label: 'Commits' },
  { value: 'repositories', label: 'Repositórios' },
  { value: 'pull-requests', label: 'Pull requests' },
  { value: 'branches', label: 'Branches' },
  { value: 'lines-added', label: 'Linhas adicionadas' },
  { value: 'lines-removed', label: 'Linhas removidas' },
  { value: 'files-changed', label: 'Arquivos alterados' },
]
