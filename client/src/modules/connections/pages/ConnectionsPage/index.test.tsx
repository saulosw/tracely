import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { authenticatedSession, githubConnection, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { sourceCatalog, upcomingSources } from '../../sources'
import { ConnectionsPage } from '.'

import type { GraphQLRequestBody, GraphQLResult } from '@/test/graphql'


afterEach(() => {
  vi.unstubAllGlobals()
})

const renderPage = (
  connections: unknown[] = [],
  route = '/connect',
  overrides: (body: GraphQLRequestBody) => GraphQLResult | null = () => null,
) => {
  const session = authenticatedSession(connections)
  const fetchMock = stubGraphQL((body) => overrides(body) ?? session(body))
  renderWithProviders(<ConnectionsPage />, route)
  return fetchMock
}

describe('ConnectionsPage', () => {
  it('opens with the page header', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Suas conexões' })).toBeInTheDocument()
  })

  it('renders one card per main source and announces the ones still coming', () => {
    renderPage()

    sourceCatalog.forEach(({ name }) => {
      expect(screen.getByRole('img', { name })).toBeInTheDocument()
    })

    expect(screen.getByText('Mais fontes, em breve')).toBeInTheDocument()
    upcomingSources.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument()
    })
  })

  it('reflects the connection the BFF reports', async () => {
    renderPage([githubConnection])

    expect(await screen.findByText('@octocat')).toBeInTheDocument()
  })

  it('drops the connected account from the screen once it is disconnected', async () => {
    const user = userEvent.setup()
    renderPage([githubConnection], '/connect', (body) =>
      body.query.includes('DisconnectProvider') ? { data: { disconnectProvider: true } } : null,
    )

    expect(await screen.findByText('@octocat')).toBeInTheDocument()

    const [details] = screen.getAllByRole('button', { name: 'Detalhes' })
    await user.click(details)
    await user.click(screen.getByRole('button', { name: 'Desconectar GitHub' }))
    await user.click(await screen.findByRole('button', { name: 'Desconectar' }))

    await waitFor(() => expect(screen.queryByText('@octocat')).not.toBeInTheDocument())
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('explains a failed authorization when GitHub sends the reader back with an error', async () => {
    renderPage([], '/connect?error=PROVIDER_ERROR')

    expect(await screen.findByRole('alert')).toHaveTextContent('O GitHub recusou a autorização.')
  })

  it('stays quiet when the reader comes back from a successful authorization', () => {
    renderPage([githubConnection], '/connect?connected=github')

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
