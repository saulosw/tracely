import { useEffect, useState } from 'react'

import { Icon } from '@/shared/components/Icon'
import { toMarkdown } from '../../services/journalMarkdown'
import { CopyButton } from './styles'

import type { Artifact } from '../../types'


const RESET_DELAY_MS = 2000

const labels = {
  idle: 'Copiar em Markdown',
  copied: 'Copiado ✓',
  failed: 'Não deu para copiar',
} as const

type CopyState = keyof typeof labels

type CopyMarkdownButtonProps = {
  artifact: Artifact
}

export function CopyMarkdownButton({ artifact }: CopyMarkdownButtonProps) {
  const [state, setState] = useState<CopyState>('idle')

  useEffect(() => {
    if (state === 'idle') {
      return
    }
    const timer = setTimeout(() => setState('idle'), RESET_DELAY_MS)
    return () => clearTimeout(timer)
  }, [state])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown(artifact))
      setState('copied')
    } catch {
      setState('failed')
    }
  }


  return (
    <CopyButton onClick={copy} startIcon={<Icon name="copy" />}>
      {labels[state]}
    </CopyButton>
  )
}
