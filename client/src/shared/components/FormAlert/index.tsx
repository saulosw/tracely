import type { ReactNode } from 'react'

import { AlertRoot } from './styles'


type FormAlertProps = {
  children: ReactNode
}

export function FormAlert({ children }: FormAlertProps) {
  return (
    <AlertRoot variant="fine" role="alert">
      {children}
    </AlertRoot>
  )
}
