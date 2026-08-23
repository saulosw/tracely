import { GraphQLRequestError } from '@/shared/lib/graphql'


const GENERIC_MESSAGE = 'Algo deu errado por aqui. Tente novamente em instantes.'


export function describeArtifactError(error: unknown): string {
  if (!(error instanceof GraphQLRequestError)) {
    return GENERIC_MESSAGE
  }

  switch (error.code) {
    case 'NETWORK':
      return 'Não conseguimos falar com o servidor. Verifique sua conexão e tente de novo.'
    case 'UNAUTHENTICATED':
      return 'Sua sessão expirou. Entre de novo para continuar.'
    case 'VALIDATION':
      return 'Revise o período e as opções escolhidas antes de gerar de novo.'
    case 'NOT_FOUND':
      return 'Esse diário não existe mais.'
    default:
      return GENERIC_MESSAGE
  }
}
