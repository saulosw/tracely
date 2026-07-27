import { AppError } from './appError.js'


export class ValidationError extends AppError {
  readonly fields: Record<string, string>

  constructor(message: string, fields: Record<string, string> = {}) {
    super('VALIDATION', message)
    this.fields = fields
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Not authenticated') {
    super('UNAUTHENTICATED', message)
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Not allowed') {
    super('FORBIDDEN', message)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super('NOT_FOUND', message)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', message)
  }
}

export class ProviderError extends AppError {
  constructor(message: string, options?: { cause?: unknown }) {
    super('PROVIDER_ERROR', message, options)
  }
}

export class ProviderAuthError extends AppError {
  constructor(message = 'Provider authorization is no longer valid') {
    super('PROVIDER_ERROR', message)
  }
}

export class ProviderRateLimitError extends AppError {
  constructor(message = 'Provider rate limit exceeded') {
    super('PROVIDER_RATE_LIMITED', message)
  }
}

export class InfraError extends AppError {
  constructor(message: string, options?: { cause?: unknown }) {
    super('INTERNAL', message, options)
  }
}
