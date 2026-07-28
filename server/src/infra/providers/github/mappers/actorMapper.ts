import type { Actor, ProviderAccount } from '../../../../domain/index.js'


const KNOWN_BOT_LOGINS = new Set(['dependabot', 'renovate', 'github-actions', 'claude', 'copilot'])

export type GithubUserRef =
  | {
      id?: number
      login?: string
      type?: string
    }
  | null
  | undefined

export const mapActor = (user: GithubUserRef, account: ProviderAccount): Actor => {
  const login = user?.login ?? null
  const normalized = login?.replace(/\[bot\]$/, '').toLowerCase() ?? ''
  const isBot =
    user?.type === 'Bot' ||
    (login?.endsWith('[bot]') ?? false) ||
    KNOWN_BOT_LOGINS.has(normalized)

  return {
    externalId: user?.id != null ? String(user.id) : null,
    login,
    isConnectedUser: user?.id != null && String(user.id) === account.externalAccountId,
    isBot,
  }
}
