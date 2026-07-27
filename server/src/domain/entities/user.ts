export type User = {
  id: string
  firstName: string
  email: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

export type NewUser = {
  firstName: string
  email: string
  passwordHash: string
}
