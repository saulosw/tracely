import { act, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { authenticatedSession, journalArtifactPayload, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { CopyMarkdownButton } from '.'

import type { Artifact } from '../../types'


afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

const artifact = { ...journalArtifactPayload, period: 'week' } as Artifact

const renderButton = () => {
  stubGraphQL(authenticatedSession())
  renderWithProviders(<CopyMarkdownButton artifact={artifact} />, '/artifacts/journal/artifact-1')
}

describe('CopyMarkdownButton', () => {
  it('copies the panel as markdown and confirms it', async () => {
    const user = userEvent.setup()
    renderButton()

    await user.click(screen.getByRole('button', { name: 'Copiar em Markdown' }))

    expect(await screen.findByRole('button', { name: 'Copiado ✓' })).toBeInTheDocument()
    await expect(window.navigator.clipboard.readText()).resolves.toContain('# Diário —')
  })

  it('goes back to its resting label after a moment', async () => {
    Object.defineProperty(window.navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    })
    renderButton()
    vi.useFakeTimers()

    fireEvent.click(screen.getByRole('button', { name: 'Copiar em Markdown' }))
    await act(async () => {})
    expect(screen.getByRole('button', { name: 'Copiado ✓' })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByRole('button', { name: 'Copiar em Markdown' })).toBeInTheDocument()
  })

  it('says when the clipboard refused the copy', async () => {
    const user = userEvent.setup()
    renderButton()
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('denied'))

    await user.click(screen.getByRole('button', { name: 'Copiar em Markdown' }))

    expect(await screen.findByRole('button', { name: 'Não deu para copiar' })).toBeInTheDocument()
  })
})
