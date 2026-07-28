import { createHash, randomBytes } from 'node:crypto'

import type { TokenGenerator } from '../../domain/index.js'


export const createCryptoTokenGenerator = (): TokenGenerator => ({
  generate: () => randomBytes(32).toString('base64url'),
  hash: (token) => createHash('sha256').update(token).digest('hex'),
})
