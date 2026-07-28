import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'

import { describeAuthError } from '../services/authErrors'

import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'


export function useAuthSubmit<TValues extends FieldValues>(setError: UseFormSetError<TValues>) {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const submit = useCallback(
    async (action: () => Promise<void>) => {
      setFormError(null)
      try {
        await action()
        navigate('/dashboard', { replace: true })
      } catch (error) {
        const report = describeAuthError(error)
        for (const [field, message] of Object.entries(report.fields)) {
          setError(field as Path<TValues>, { type: 'server', message })
        }
        setFormError(report.message)
      }
    },
    [navigate, setError],
  )

  return { formError, submit }
}
