import type { Provider } from './provider.js'


export type ProjectVisibility = 'public' | 'private'

export type Project = {
  id: string
  connectionId: string
  provider: Provider
  externalId: string
  name: string
  fullName: string
  ownerLogin: string
  description: string | null
  visibility: ProjectVisibility
  isFork: boolean
  isArchived: boolean
  defaultBranch: string | null
  primaryLanguage: string | null
  providerCreatedAt: Date | null
  providerPushedAt: Date | null
  lastSyncedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type NewProject = Omit<Project, 'id' | 'lastSyncedAt' | 'createdAt' | 'updatedAt'>
