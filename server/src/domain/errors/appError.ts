export type AppErrorCode =
  | 'VALIDATION'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'PROVIDER_ERROR'
  | 'PROVIDER_RATE_LIMITED'
  | 'INTERNAL'

export class AppError extends Error {
  readonly code: AppErrorCode

  constructor(code: AppErrorCode, message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.code = code
    this.name = new.target.name
  }
}

export const safeErrorMessage = (error: unknown): string =>
  error instanceof AppError ? error.message : 'Unexpected error'
