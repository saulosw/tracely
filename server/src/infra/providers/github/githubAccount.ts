import type { Octokit } from '@octokit/rest'

import type { ProviderAccount } from '../../../domain/index.js'


export const fetchGithubAccount = async (octokit: Octokit): Promise<ProviderAccount> => {
  const { data: user } = await octokit.users.getAuthenticated()

  let emails: string[] = []
  try {
    const { data } = await octokit.users.listEmailsForAuthenticatedUser({ per_page: 100 })
    emails = data.map((entry) => entry.email)
  } catch {
    emails = []
  }

  return {
    provider: 'github',
    externalAccountId: String(user.id),
    login: user.login,
    name: user.name ?? null,
    avatarUrl: user.avatar_url ?? null,
    emails,
  }
}
