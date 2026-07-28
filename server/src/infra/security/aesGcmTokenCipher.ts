import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

import { InfraError } from '../../domain/index.js'

import type { TokenCipher } from '../../domain/index.js'


const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16
const VERSION = 'v1'

export const createAesGcmTokenCipher = (key: Buffer): TokenCipher => {
  if (key.byteLength !== 32) {
    throw new InfraError('Token encryption key must be 32 bytes')
  }

  return {
    encrypt(plain) {
      const iv = randomBytes(IV_LENGTH)
      const cipher = createCipheriv('aes-256-gcm', key, iv, { authTagLength: AUTH_TAG_LENGTH })
      const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
      const tag = cipher.getAuthTag()
      return `${VERSION}:${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`
    },

    decrypt(payload) {
      const [version, ivB64, tagB64, dataB64] = payload.split(':')
      if (version !== VERSION || !ivB64 || !tagB64 || !dataB64) {
        throw new InfraError('Unsupported encrypted token format')
      }
      try {
        const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(ivB64, 'base64'), {
          authTagLength: AUTH_TAG_LENGTH,
        })
        decipher.setAuthTag(Buffer.from(tagB64, 'base64'))
        return Buffer.concat([
          decipher.update(Buffer.from(dataB64, 'base64')),
          decipher.final(),
        ]).toString('utf8')
      } catch (error) {
        throw new InfraError('Failed to decrypt token', { cause: error })
      }
    },
  }
}
