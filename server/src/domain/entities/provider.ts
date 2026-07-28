export const PROVIDERS = ['github'] as const

export type Provider = (typeof PROVIDERS)[number]

export type ProviderAccount = {
  provider: Provider
  externalAccountId: string
  login: string
  name: string | null
  avatarUrl: string | null
  emails: string[]
}
