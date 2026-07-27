import { eq } from 'drizzle-orm'

import { users } from '../database/schema/index.js'
import { requireRow } from './rows.js'

import type { UserRepository } from '../../domain/index.js'
import type { Database } from '../database/index.js'


export const createDrizzleUserRepository = (db: Database): UserRepository => ({
  async findByEmail(email) {
    const [row] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    return row ?? null
  },

  async findById(id) {
    const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1)
    return row ?? null
  },

  async create(user) {
    const [row] = await db.insert(users).values(user).returning()
    return requireRow(row)
  },
})
