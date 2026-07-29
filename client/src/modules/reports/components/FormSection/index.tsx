import { StatusPill } from '@/shared/components/StatusPill'
import {
  SectionBody,
  SectionHead,
  SectionHint,
  SectionOptional,
  SectionRoot,
  SectionTitle,
} from './styles'

import type { ReactNode } from 'react'


type FormSectionProps = {
  title: string
  hint?: string
  pro?: boolean
  optional?: boolean
  children: ReactNode
}

export function FormSection({
  title,
  hint,
  pro = false,
  optional = false,
  children,
}: FormSectionProps) {
  return (
    <SectionRoot component="section">
      <SectionHead>
        <SectionTitle variant="sectionTitle">{title}</SectionTitle>
        {optional ? <SectionOptional variant="label">— opcional</SectionOptional> : null}
        {pro ? <StatusPill tone="pro">Pro</StatusPill> : null}
      </SectionHead>

      {hint ? <SectionHint variant="fine">{hint}</SectionHint> : null}

      <SectionBody>{children}</SectionBody>
    </SectionRoot>
  )
}
