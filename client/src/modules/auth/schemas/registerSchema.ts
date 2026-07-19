import { z } from 'zod'


const FIRST_NAME_PATTERN = /^\p{L}+$/u
const HAS_LOWERCASE = /\p{Ll}/u
const HAS_UPPERCASE = /\p{Lu}/u
const HAS_DIGIT = /\d/
const HAS_SPECIAL = /[^\p{L}\p{N}]/u

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, 'Informe seu primeiro nome.')
      .min(2, 'Seu nome deve ter ao menos 2 caracteres.')
      .max(30, 'Seu nome deve ter no máximo 30 caracteres.')
      .regex(FIRST_NAME_PATTERN, 'Use apenas o primeiro nome, sem espaços, números ou símbolos.'),

    email: z
      .string()
      .trim()
      .min(1, 'Informe seu e-mail.')
      .max(254, 'O e-mail deve ter no máximo 254 caracteres.')
      .pipe(z.email('Informe um e-mail válido.')),

    password: z
      .string()
      .min(1, 'Informe uma senha.')
      .min(8, 'A senha deve ter ao menos 8 caracteres.')
      .max(64, 'A senha deve ter no máximo 64 caracteres.')
      .regex(HAS_UPPERCASE, 'A senha deve conter ao menos uma letra maiúscula.')
      .regex(HAS_LOWERCASE, 'A senha deve conter ao menos uma letra minúscula.')
      .regex(HAS_DIGIT, 'A senha deve conter ao menos um número.')
      .regex(HAS_SPECIAL, 'A senha deve conter ao menos um caractere especial.'),

    confirmPassword: z.string().min(1, 'Confirme sua senha.'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword && password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'As senhas não coincidem.',
      })
    }
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
