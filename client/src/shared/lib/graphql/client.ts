import { GraphQLRequestError } from './errors'

import type { GraphQLErrorCode, GraphQLErrorFields } from './errors'


const endpoint = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/graphql'

type GraphQLResponse<TData> = {
  data?: TData | null
  errors?: {
    message: string
    extensions?: { code?: string; fields?: GraphQLErrorFields }
  }[]
}

const KNOWN_CODES: GraphQLErrorCode[] = [
  'VALIDATION',
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'PROVIDER_ERROR',
  'PROVIDER_RATE_LIMITED',
  'INTERNAL_SERVER_ERROR',
]

const toErrorCode = (code: unknown): GraphQLErrorCode =>
  KNOWN_CODES.find((known) => known === code) ?? 'UNKNOWN'


export async function graphqlRequest<TData, TVariables = Record<string, unknown>>(
  document: string,
  variables?: TVariables,
): Promise<TData> {
  let response: Response
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: document, variables }),
    })
  } catch {
    throw new GraphQLRequestError('Request failed', 'NETWORK', {})
  }

  let body: GraphQLResponse<TData>
  try {
    body = (await response.json()) as GraphQLResponse<TData>
  } catch {
    throw new GraphQLRequestError('Malformed response', 'NETWORK', {})
  }

  const [firstError] = body.errors ?? []
  if (firstError) {
    throw new GraphQLRequestError(
      firstError.message,
      toErrorCode(firstError.extensions?.code),
      firstError.extensions?.fields ?? {},
    )
  }

  if (!body.data) {
    throw new GraphQLRequestError('Empty response', 'UNKNOWN', {})
  }

  return body.data
}
