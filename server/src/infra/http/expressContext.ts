import type { User } from '../../domain/index.js'


declare module 'express-serve-static-core' {
  interface Request {
    currentUser?: User | null
    sessionToken?: string | null
  }
}

export {}
