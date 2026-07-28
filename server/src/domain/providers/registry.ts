import type { Provider } from '../entities/index.js'


export type ProviderRegistry<T> = {
  get(provider: Provider): T
}

export const createProviderRegistry = <T>(entries: Record<Provider, T>): ProviderRegistry<T> => ({
  get: (provider) => entries[provider],
})
