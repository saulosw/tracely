export type GraphQLErrorCode =
  | 'VALIDATION'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'PROVIDER_ERROR'
  | 'PROVIDER_RATE_LIMITED'
  | 'INTERNAL_SERVER_ERROR'
  | 'NETWORK'
  | 'UNKNOWN'

export type GraphQLErrorFields = Record<string, string>


export class GraphQLRequestError extends Error {
  readonly code: GraphQLErrorCode
  readonly fields: GraphQLErrorFields

  constructor(message: string, code: GraphQLErrorCode, fields: GraphQLErrorFields = {}) {
    super(message)
    this.name = 'GraphQLRequestError'
    this.code = code
    this.fields = fields
  }
}
