import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { anonymousSession, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { StatusPill } from '.'


afterEach(() => {
  vi.unstubAllGlobals()
})

const renderPill = (ui: Parameters<typeof renderWithProviders>[0]) => {
  stubGraphQL(() => anonymousSession())
  renderWithProviders(ui)
}

describe('StatusPill', () => {
  it('shows the status it was given', () => {
    renderPill(<StatusPill>Conectado</StatusPill>)

    expect(screen.getByText('Conectado')).toBeInTheDocument()
  })

  it('keeps the label readable on every tone', () => {
    renderPill(
      <>
        <StatusPill tone="accent">Incluído</StatusPill>
        <StatusPill tone="muted">Bloqueado</StatusPill>
        <StatusPill tone="pro">Pro</StatusPill>
      </>,
    )

    expect(screen.getByText('Incluído')).toBeInTheDocument()
    expect(screen.getByText('Bloqueado')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
  })
})
