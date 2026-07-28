import { randomBytes } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { InfraError } from '../../src/domain/index.js'
import { createAesGcmTokenCipher } from '../../src/infra/security/index.js'


describe('aesGcmTokenCipher', () => {
  const key = randomBytes(32)
  const cipher = createAesGcmTokenCipher(key)

  it('round-trips a token', () => {
    const encrypted = cipher.encrypt('gho_secret_token')
    expect(encrypted.startsWith('v1:')).toBe(true)
    expect(encrypted).not.toContain('gho_secret_token')
    expect(cipher.decrypt(encrypted)).toBe('gho_secret_token')
  })

  it('produces distinct ciphertexts for the same input', () => {
    expect(cipher.encrypt('same')).not.toBe(cipher.encrypt('same'))
  })

  it('rejects tampered payloads', () => {
    const encrypted = cipher.encrypt('gho_secret_token')
    const parts = encrypted.split(':')
    const data = Buffer.from(parts[3]!, 'base64')
    data[0] = data[0]! ^ 0xff
    const tampered = `${parts[0]}:${parts[1]}:${parts[2]}:${data.toString('base64')}`
    expect(() => cipher.decrypt(tampered)).toThrow(InfraError)
  })

  it('rejects payloads encrypted with another key', () => {
    const other = createAesGcmTokenCipher(randomBytes(32))
    const encrypted = other.encrypt('gho_secret_token')
    expect(() => cipher.decrypt(encrypted)).toThrow(InfraError)
  })

  it('rejects unknown formats', () => {
    expect(() => cipher.decrypt('v2:a:b:c')).toThrow(InfraError)
    expect(() => cipher.decrypt('garbage')).toThrow(InfraError)
  })

  it('requires a 32-byte key', () => {
    expect(() => createAesGcmTokenCipher(randomBytes(16))).toThrow(InfraError)
  })
})
