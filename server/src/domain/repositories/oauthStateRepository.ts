import type { OAuthState } from '../entities/index.js'


export type OAuthStateRepository = {
  create(state: OAuthState): Promise<void>
  consume(state: string): Promise<OAuthState | null>
}
