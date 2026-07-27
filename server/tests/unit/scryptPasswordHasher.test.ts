import { describe, expect, it } from 'vitest'

import { createScryptPasswordHasher } from '../../src/infra/security/index.js'


describe('scryptPasswordHasher', () => {
  const hasher = createScryptPasswordHasher()

  it('verifies a password against its own hash', async () => {
    const hash = await hasher.hash('S3nha!forte')
    expect(hash.startsWith('scrypt$32768$8$1$')).toBe(true)
    await expect(hasher.verify('S3nha!forte', hash)).resolves.toBe(true)
  })

  it('rejects a wrong password', async () => {
    const hash = await hasher.hash('S3nha!forte')
    await expect(hasher.verify('S3nha!errada', hash)).resolves.toBe(false)
  })

  it('produces distinct hashes for the same password', async () => {
    const first = await hasher.hash('S3nha!forte')
    const second = await hasher.hash('S3nha!forte')
    expect(first).not.toBe(second)
  })

  it('rejects malformed stored hashes without throwing', async () => {
    await expect(hasher.verify('anything', 'not-a-hash')).resolves.toBe(false)
    await expect(hasher.verify('anything', 'scrypt$x$y$z$$')).resolves.toBe(false)
    await expect(hasher.verify('anything', '')).resolves.toBe(false)
  })
})
