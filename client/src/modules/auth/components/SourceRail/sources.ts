import type { SourceId } from '@/shared/components/SourceGlyph'


type Source = {
  id: SourceId
  label: string
}

export const sources: Source[] = [
  { id: 'github', label: 'GitHub' },
  { id: 'gitlab', label: 'GitLab' },
  { id: 'linear', label: 'Linear' },
  { id: 'jira', label: 'Jira' },
  { id: 'notion', label: 'Notion' },
  { id: 'google-workspace', label: 'Google Workspace' },
  { id: 'obsidian', label: 'Obsidian' },
  { id: 'slack', label: 'Slack' },
]
