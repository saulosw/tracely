import type { SourceId } from '@/shared/components/SourceGlyph'
import type { Provider, SourceCatalogEntry, UpcomingSource } from './types'


export const sourceCatalog: SourceCatalogEntry[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Lê commits, pull requests e a atividade dos seus repositórios.',
    provider: 'GITHUB',
    detail:
      'Commits, pull requests e metadados dos repositórios — somente leitura, sempre. Nunca enviamos, editamos ou apagamos nada nos seus repos, e lemos apenas os repositórios aos quais você der acesso.',
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Traz issues, sprints e os tickets que você fechou.',
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'Traz suas notas diárias e entradas de diário para a história.',
  },
]

export const upcomingSources: UpcomingSource[] = [
  { id: 'gitlab', name: 'GitLab' },
  { id: 'linear', name: 'Linear' },
  { id: 'notion', name: 'Notion' },
  { id: 'google-workspace', name: 'Google Workspace' },
  { id: 'slack', name: 'Slack' },
]

export const sourceIdOf = (provider: Provider): SourceId =>
  sourceCatalog.find((source) => source.provider === provider)?.id ?? 'github'
