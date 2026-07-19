import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { TextField } from '@/shared/components/TextField'
import { useAuth } from '../../hooks/useAuth'
import type { LoginFormValues } from '../../schemas/loginSchema'
import { loginSchema } from '../../schemas/loginSchema'
import { ForgotLink, Form, SubmitButton } from './styles'


export function LoginForm() {
  const { signIn, isSubmitting } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  })


  return (
    <Form component="form" onSubmit={handleSubmit(signIn)} noValidate>
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
        trailing={<ForgotLink href="#">Esqueceu?</ForgotLink>}
        registration={register('password')}
        error={errors.password?.message}
      />

      <SubmitButton type="submit" variant="outline" fullWidth disabled={isSubmitting}>
        Entrar
      </SubmitButton>
    </Form>
  )
}
