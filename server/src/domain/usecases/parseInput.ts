import { ValidationError } from '../errors/index.js'

import type { z } from 'zod'


export const parseInput = <Output>(schema: z.ZodType<Output>, input: unknown): Output => {
  const result = schema.safeParse(input)
  if (!result.success) {
    const fields: Record<string, string> = {}
    for (const issue of result.error.issues) {
      const key = issue.path.join('.') || '_'
      fields[key] ??= issue.message
    }
    throw new ValidationError('Invalid input', fields)
  }
  return result.data
}
