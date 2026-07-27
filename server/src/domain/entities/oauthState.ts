import type { Provider } from './provider.js'


export type OAuthState = {
  state: string
  userId: string
  provider: Provider
  expiresAt: Date
}
