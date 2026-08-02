import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { anonymousSession, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { HistoryPage } from '.'


afterEach(() => {
  vi.unstubAllGlobals()
})

const renderPage = () => {
  stubGraphQL(() => anonymousSession())
  renderWithProviders(<HistoryPage />, '/history')
}

describe('HistoryPage', () => {
  it('opens with the page header', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Histórico' })).toBeInTheDocument()
  })

  it('explains the emptiness and offers the way out of it', () => {
    renderPage()

    expect(screen.getByText('Nenhum capítulo ainda')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Escrever o primeiro capítulo →' })).toHaveAttribute(
      'href',
      '/artifacts/insights',
    )
  })
})
