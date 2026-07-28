import type { RestEndpointMethodTypes } from '@octokit/rest'

import type { SourceProject } from '../../../../domain/index.js'


export type GithubRepository =
  RestEndpointMethodTypes['repos']['listForAuthenticatedUser']['response']['data'][number]

export const mapRepository = (repo: GithubRepository): SourceProject => ({
  provider: 'github',
  externalId: String(repo.id),
  name: repo.name,
  fullName: repo.full_name,
  ownerLogin: repo.owner.login,
  description: repo.description,
  visibility: repo.private ? 'private' : 'public',
  isFork: repo.fork,
  isArchived: repo.archived ?? false,
  defaultBranch: repo.default_branch ?? null,
  primaryLanguage: repo.language ?? null,
  providerCreatedAt: repo.created_at ? new Date(repo.created_at) : null,
  providerPushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
})
