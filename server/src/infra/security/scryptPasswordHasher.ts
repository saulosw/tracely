import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

import type { BinaryLike, ScryptOptions } from 'node:crypto'

import type { PasswordHasher } from '../../domain/index.js'


const scryptAsync = promisify<BinaryLike, BinaryLike, number, ScryptOptions, Buffer>(scrypt)

const SCRYPT_N = 32768
const SCRYPT_R = 8
const SCRYPT_P = 1
const SALT_LENGTH = 16
const KEY_LENGTH = 64
const MAX_MEM = 64 * 1024 * 1024

const derive = async (plain: string, salt: Buffer, length: number, n: number, r: number, p: number) =>
  (await scryptAsync(plain, salt, length, { N: n, r, p, maxmem: MAX_MEM })) as Buffer

export const createScryptPasswordHasher = (): PasswordHasher => ({
  async hash(plain) {
    const salt = randomBytes(SALT_LENGTH)
    const key = await derive(plain, salt, KEY_LENGTH, SCRYPT_N, SCRYPT_R, SCRYPT_P)
    const saltB64 = salt.toString('base64')
    const keyB64 = key.toString('base64')
    return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${saltB64}$${keyB64}`
  },

  async verify(plain, hashed) {
    const [scheme, nRaw, rRaw, pRaw, saltB64, keyB64] = hashed.split('$')
    if (scheme !== 'scrypt' || !nRaw || !rRaw || !pRaw || !saltB64 || !keyB64) {
      return false
    }
    const n = Number(nRaw)
    const r = Number(rRaw)
    const p = Number(pRaw)
    if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p)) {
      return false
    }
    const salt = Buffer.from(saltB64, 'base64')
    const expected = Buffer.from(keyB64, 'base64')
    if (salt.length === 0 || expected.length === 0) {
      return false
    }
    const key = await derive(plain, salt, expected.length, n, r, p)
    return timingSafeEqual(key, expected)
  },
})
