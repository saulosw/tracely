import { GraphQLRequestError } from '@/shared/lib/graphql'


const GENERIC_MESSAGE = 'Algo deu errado por aqui. Tente novamente em instantes.'

const CALLBACK_MESSAGES: Record<string, string> = {
  UNAUTHENTICATED: 'A autorização expirou antes de voltarmos. Tente conectar de novo.',
  VALIDATION: 'O GitHub devolveu uma resposta incompleta. Tente conectar de novo.',
  FORBIDDEN: 'Essa autorização não pertence à sua conta.',
  PROVIDER_ERROR: 'O GitHub recusou a autorização. Tente conectar de novo.',
  PROVIDER_RATE_LIMITED: 'O GitHub está limitando as chamadas agora. Tente daqui a pouco.',
}


export function describeConnectionError(error: unknown): string {
  if (!(error instanceof GraphQLRequestError)) {
    return GENERIC_MESSAGE
  }

  switch (error.code) {
    case 'NETWORK':
      return 'Não conseguimos falar com o servidor. Verifique sua conexão e tente de novo.'
    case 'UNAUTHENTICATED':
      return 'Sua sessão expirou. Entre de novo para continuar.'
    case 'NOT_FOUND':
      return 'Essa conexão não existe mais.'
    case 'PROVIDER_ERROR':
      return 'O GitHub recusou a operação. Tente de novo em instantes.'
    case 'PROVIDER_RATE_LIMITED':
      return 'O GitHub está limitando as chamadas agora. Tente daqui a pouco.'
    default:
      return GENERIC_MESSAGE
  }
}

export function describeCallbackError(code: string): string {
  return CALLBACK_MESSAGES[code] ?? GENERIC_MESSAGE
}
