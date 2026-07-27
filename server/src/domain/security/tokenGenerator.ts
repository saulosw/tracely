export type TokenGenerator = {
  generate(): string
  hash(token: string): string
}
