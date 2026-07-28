import type { NewUser, User } from '../entities/index.js'


export type UserRepository = {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  create(user: NewUser): Promise<User>
}
