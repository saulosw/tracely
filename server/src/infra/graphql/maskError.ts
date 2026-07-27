import { GraphQLError } from 'graphql'

import { AppError, ValidationError } from '../../domain/index.js'

import type { Logger } from '../logging/index.js'


const unwrapOriginalError = (error: unknown): unknown => {
  if (error instanceof Error && 'originalError' in error) {
    const original = (error as { originalError?: unknown }).originalError
    if (original) {
      return original
    }
  }
  return error
}

const isBareGraphQLError = (error: unknown): error is GraphQLError =>
  error instanceof Error &&
  error.name === 'GraphQLError' &&
  !(error as { originalError?: unknown }).originalError

export const createMaskError = (logger: Logger) => {
  return (error: unknown, message: string): GraphQLError => {
    const original = unwrapOriginalError(error)

    if (original instanceof AppError) {
      const extensions: Record<string, unknown> = { code: original.code }
      if (original instanceof ValidationError) {
        extensions.fields = original.fields
      }
      return new GraphQLError(original.message, { extensions })
    }

    if (isBareGraphQLError(error)) {
      return error
    }

    logger.error({ err: original }, 'unexpected graphql error')
    return new GraphQLError(message, { extensions: { code: 'INTERNAL_SERVER_ERROR' } })
  }
}
