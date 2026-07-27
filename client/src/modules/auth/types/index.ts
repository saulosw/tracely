export type AuthUser = {
  id: string
  firstName: string
  email: string
}

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

export type SignInInput = {
  email: string
  password: string
}

export type SignUpInput = {
  firstName: string
  email: string
  password: string
}
