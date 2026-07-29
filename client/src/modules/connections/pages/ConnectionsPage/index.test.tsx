import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { anonymousSession, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { connectionSources, upcomingSources } from '../../sources'
import { ConnectionsPage } from '.'


afterEach(() => {
  vi.unstubAllGlobals()
})

const renderPage = () => {
  stubGraphQL(() => anonymousSession())
  renderWithProviders(<ConnectionsPage />, '/connect')
}

describe('ConnectionsPage', () => {
  it('opens with the page header', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Suas conexões' })).toBeInTheDocument()
  })

  it('renders one card per main source and announces the ones still coming', () => {
    renderPage()

    connectionSources.forEach(({ name }) => {
      expect(screen.getByRole('img', { name })).toBeInTheDocument()
    })

    expect(screen.getByText('Mais fontes, em breve')).toBeInTheDocument()
    upcomingSources.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument()
    })
  })
})
