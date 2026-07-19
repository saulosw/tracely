import { z } from 'zod'


export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail.')
    .max(254, 'O e-mail deve ter no máximo 254 caracteres.')
    .pipe(z.email('Informe um e-mail válido.')),

  password: z
    .string()
    .min(1, 'Informe sua senha.')
    .min(8, 'A senha deve ter ao menos 8 caracteres.')
    .max(64, 'A senha deve ter no máximo 64 caracteres.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
