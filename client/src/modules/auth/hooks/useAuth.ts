import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'


export function useAuth() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const enterApp = useCallback(() => {
    setIsSubmitting(true)
    navigate('/dashboard')
  }, [navigate])

  const signIn = useCallback(() => {
    enterApp()
  }, [enterApp])

  const signUp = useCallback(() => {
    enterApp()
  }, [enterApp])

  return {
    // TODO: stub — sempre autenticado enquanto não existe backend, o que torna
    // ProtectedRoute um no-op. Substituir por estado real antes de qualquer deploy.
    isAuthenticated: true,
    isSubmitting,
    signIn,
    signUp,
  }
}
