import type { NewSession, Session } from '../entities/index.js'


export type SessionRepository = {
  create(session: NewSession): Promise<Session>
  findActiveByTokenHash(tokenHash: string, now: Date): Promise<Session | null>
  deleteByTokenHash(tokenHash: string): Promise<void>
}
