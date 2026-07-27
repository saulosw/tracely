import type { ProviderAccount } from '../entities/index.js'


export type OAuthTokenResult = {
  accessToken: string
  scopes: string[]
}

export type ProviderOAuthClient = {
  buildAuthorizeUrl(state: string): string
  exchangeCode(code: string): Promise<OAuthTokenResult>
  fetchAccount(accessToken: string): Promise<ProviderAccount>
  revokeGrant(accessToken: string): Promise<void>
}
