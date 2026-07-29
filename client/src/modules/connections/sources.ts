import type { ConnectionSource, UpcomingSource } from './types'


export const connectionSources: ConnectionSource[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Lê commits, pull requests e a atividade dos seus repositórios.',
    state: 'disconnected',
    detail:
      'Commits, pull requests e metadados dos repositórios — somente leitura, sempre. Nunca enviamos, editamos ou apagamos nada nos seus repos, e lemos apenas os repositórios aos quais você der acesso.',
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Traz issues, sprints e os tickets que você fechou.',
    state: 'unavailable',
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'Traz suas notas diárias e entradas de diário para a história.',
    state: 'unavailable',
  },
]

export const upcomingSources: UpcomingSource[] = [
  { id: 'gitlab', name: 'GitLab' },
  { id: 'linear', name: 'Linear' },
  { id: 'notion', name: 'Notion' },
  { id: 'google-workspace', name: 'Google Workspace' },
  { id: 'slack', name: 'Slack' },
]
