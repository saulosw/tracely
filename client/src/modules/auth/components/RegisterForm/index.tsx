import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { FormAlert } from '@/shared/components/FormAlert'
import { TextField } from '@/shared/components/TextField'
import { useAuth } from '../../hooks/useAuth'
import { useAuthSubmit } from '../../hooks/useAuthSubmit'
import type { RegisterFormValues } from '../../schemas/registerSchema'
import { registerSchema } from '../../schemas/registerSchema'
import { Form, PasswordRow, SubmitButton } from './styles'


export function RegisterForm() {
  const { signUp } = useAuth()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: { firstName: '', email: '', password: '', confirmPassword: '' },
  })
  const { formError, submit } = useAuthSubmit(setError)


  return (
    <Form
      component="form"
      onSubmit={handleSubmit(({ firstName, email, password }) =>
        submit(() => signUp({ firstName, email, password })),
      )}
      noValidate
    >
      {formError ? <FormAlert>{formError}</FormAlert> : null}

      <TextField
        label="Primeiro nome"
        type="text"
        autoComplete="given-name"
        placeholder="Alex"
        helperText="Apenas seu primeiro nome — é assim que o Tracely vai te chamar."
        registration={register('firstName')}
        error={errors.firstName?.message}
      />

      <TextField
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="voce@exemplo.com"
        registration={register('email')}
        error={errors.email?.message}
      />

      <PasswordRow>
        <TextField
          label="Senha"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          registration={register('password')}
          error={errors.password?.message}
        />
        <TextField
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          registration={register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
      </PasswordRow>

      <SubmitButton type="submit" variant="outline" fullWidth loading={isSubmitting}>
        Criar conta
      </SubmitButton>
    </Form>
  )
}
