import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputBase from '@mui/material/InputBase'
import type { InputBaseProps } from '@mui/material/InputBase'
import { useId } from 'react'
import type { ReactNode } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

import { FieldLabel, LabelRow } from './styles'


type TextFieldProps = Omit<InputBaseProps, 'id' | 'error' | 'inputRef'> & {
  label: string
  registration?: UseFormRegisterReturn
  error?: string
  helperText?: string
  trailing?: ReactNode
}

export function TextField({
  label,
  registration,
  error,
  helperText,
  trailing,
  ...rest
}: TextFieldProps) {
  const inputId = useId()
  const messageId = `${inputId}-message`
  const message = error ?? helperText
  const { ref, ...field } = registration ?? {}


  return (
    <FormControl error={Boolean(error)}>
      <LabelRow>
        <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
        {trailing}
      </LabelRow>
      <InputBase
        id={inputId}
        inputRef={ref}
        error={Boolean(error)}
        aria-describedby={message ? messageId : undefined}
        {...rest}
        {...field}
      />
      {message ? <FormHelperText id={messageId}>{message}</FormHelperText> : null}
    </FormControl>
  )
}
