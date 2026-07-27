import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { FormAlert } from '@/shared/components/FormAlert'
import { TextField } from '@/shared/components/TextField'
import { useAuth } from '../../hooks/useAuth'
import { useAuthSubmit } from '../../hooks/useAuthSubmit'
import type { LoginFormValues } from '../../schemas/loginSchema'
import { loginSchema } from '../../schemas/loginSchema'
import { Form, SubmitButton } from './styles'


export function LoginForm() {
  const { signIn } = useAuth()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  })
  const { formError, submit } = useAuthSubmit(setError)


  return (
    <Form
      component="form"
      onSubmit={handleSubmit((values) => submit(() => signIn(values)))}
      noValidate
    >
      {formError ? <FormAlert>{formError}</FormAlert> : null}

      <TextField
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="voce@exemplo.com"
        registration={register('email')}
        error={errors.email?.message}
      />

      <TextField
        label="Senha"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        registration={register('password')}
        error={errors.password?.message}
      />

      <SubmitButton type="submit" variant="outline" fullWidth loading={isSubmitting}>
        Entrar
      </SubmitButton>
    </Form>
  )
}
