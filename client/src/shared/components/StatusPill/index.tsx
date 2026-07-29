import { PillRoot } from './styles'

import type { ReactNode } from 'react'
import type { StatusTone } from './styles'


type StatusPillProps = {
  tone?: StatusTone
  children: ReactNode
}

export function StatusPill({ tone = 'neutral', children }: StatusPillProps) {
  return (
    <PillRoot tone={tone} variant="meta">
      {children}
    </PillRoot>
  )
}

export type { StatusTone }
