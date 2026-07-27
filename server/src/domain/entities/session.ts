export type Session = {
  id: string
  userId: string
  tokenHash: string
  expiresAt: Date
  createdAt: Date
}

export type NewSession = {
  userId: string
  tokenHash: string
  expiresAt: Date
}
