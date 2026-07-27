import { graphqlRequest } from '@/shared/lib/graphql'

import type { AuthUser, SignInInput, SignUpInput } from '../types'


const USER_FIELDS = `
  id
  firstName
  email
`

const ME_QUERY = `
  query Me {
    me { ${USER_FIELDS} }
  }
`

const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user { ${USER_FIELDS} }
    }
  }
`

const REGISTER_MUTATION = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user { ${USER_FIELDS} }
    }
  }
`

const LOGOUT_MUTATION = `
  mutation Logout {
    logout
  }
`

type AuthPayload = { user: AuthUser }


export const fetchMe = async (): Promise<AuthUser | null> => {
  const data = await graphqlRequest<{ me: AuthUser | null }>(ME_QUERY)
  return data.me
}

export const login = async (input: SignInInput): Promise<AuthUser> => {
  const data = await graphqlRequest<{ login: AuthPayload }, { input: SignInInput }>(
    LOGIN_MUTATION,
    { input },
  )
  return data.login.user
}

export const register = async (input: SignUpInput): Promise<AuthUser> => {
  const data = await graphqlRequest<{ register: AuthPayload }, { input: SignUpInput }>(
    REGISTER_MUTATION,
    { input },
  )
  return data.register.user
}

export const logout = async (): Promise<void> => {
  await graphqlRequest<{ logout: boolean }>(LOGOUT_MUTATION)
}
