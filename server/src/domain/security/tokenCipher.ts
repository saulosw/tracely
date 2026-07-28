export type TokenCipher = {
  encrypt(plain: string): string
  decrypt(encrypted: string): string
}
