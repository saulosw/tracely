import { useCallback, useEffect, useMemo, useState } from 'react'

import { AuthContext } from '../../hooks/useAuth'
import { fetchMe, login, logout, register } from '../../services/authApi'

import type { AuthStatus, AuthUser, SignInInput, SignUpInput } from '../../types'
import type { ReactNode } from 'react'


type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    let active = true

    const resolve = (current: AuthUser | null) => {
      if (!active) {
        return
      }
      setUser(current)
      setStatus(current ? 'authenticated' : 'anonymous')
    }

    fetchMe()
      .then(resolve)
      .catch(() => resolve(null))

    return () => {
      active = false
    }
  }, [])

  const signIn = useCallback(async (input: SignInInput) => {
    const current = await login(input)
    setUser(current)
    setStatus('authenticated')
  }, [])

  const signUp = useCallback(async (input: SignUpInput) => {
    const current = await register(input)
    setUser(current)
    setStatus('authenticated')
  }, [])

  const signOut = useCallback(async () => {
    await logout()
    setUser(null)
    setStatus('anonymous')
  }, [])

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      signIn,
      signUp,
      signOut,
    }),
    [user, status, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
