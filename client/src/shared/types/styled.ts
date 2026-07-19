import type { ElementType, FormHTMLAttributes } from 'react'


export type AsElement = {
  component?: ElementType
}

export type AsLink = AsElement & {
  to?: string
}

export type AsForm = AsElement & Pick<FormHTMLAttributes<HTMLFormElement>, 'noValidate'>
