import { GraphQLRequestError } from '@/shared/lib/graphql'


export type AuthErrorReport = {
  message: string | null
  fields: Record<string, string>
}

const GENERIC_MESSAGE = 'Algo deu errado por aqui. Tente novamente em instantes.'


export function describeAuthError(error: unknown): AuthErrorReport {
  if (!(error instanceof GraphQLRequestError)) {
    return { message: GENERIC_MESSAGE, fields: {} }
  }

  switch (error.code) {
    case 'NETWORK':
      return {
        message: 'Não conseguimos falar com o servidor. Verifique sua conexão e tente de novo.',
        fields: {},
      }
    case 'UNAUTHENTICATED':
      return { message: 'E-mail ou senha incorretos.', fields: {} }
    case 'CONFLICT':
      return { message: null, fields: { email: 'Este e-mail já está cadastrado.' } }
    case 'VALIDATION': {
      const fields = Object.fromEntries(
        Object.keys(error.fields).map((field) => [field, 'Valor inválido.']),
      )
      return {
        message: Object.keys(fields).length > 0 ? null : GENERIC_MESSAGE,
        fields,
      }
    }
    default:
      return { message: GENERIC_MESSAGE, fields: {} }
  }
}
