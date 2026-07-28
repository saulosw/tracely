import {
  AppError,
  ProviderAuthError,
  ProviderError,
  ProviderRateLimitError,
} from '../../../domain/index.js'


type RequestErrorLike = {
  status?: number
  response?: { headers?: Record<string, string | number | undefined> }
}

export const translateGithubError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error
  }
  const { status, response } = (error ?? {}) as RequestErrorLike
  if (status === 401) {
    return new ProviderAuthError()
  }
  const remaining = response?.headers?.['x-ratelimit-remaining']
  if (status === 429 || (status === 403 && String(remaining) === '0')) {
    return new ProviderRateLimitError('GitHub rate limit exceeded')
  }
  if (typeof status === 'number') {
    return new ProviderError(`GitHub request failed with status ${status}`, { cause: error })
  }
  return new ProviderError('GitHub request failed', { cause: error })
}
