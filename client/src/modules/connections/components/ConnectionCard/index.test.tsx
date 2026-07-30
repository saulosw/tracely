import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { anonymousSession, githubConnection, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { ConnectionCard } from '.'

import type { GraphQLRequestBody, GraphQLResult } from '@/test/graphql'
import type { ConnectionSource, ProviderConnection } from '../../types'


afterEach(() => {
  vi.unstubAllGlobals()
})

const github = (overrides: Partial<ConnectionSource> = {}): ConnectionSource => ({
  id: 'github',
  name: 'GitHub',
  description: 'Lê commits e pull requests.',
  provider: 'GITHUB',
  detail: 'Somente leitura, sempre.',
  state: 'disconnected',
  connection: null,
  ...overrides,
})

const connected = (status: ProviderConnection['status'] = 'ACTIVE'): ConnectionSource =>
  github({ state: 'connected', connection: { ...githubConnection, status } as ProviderConnection })

const jira: ConnectionSource = {
  id: 'jira',
  name: 'Jira',
  description: 'Traz issues e sprints.',
  state: 'unavailable',
  connection: null,
}

const renderCard = (
  source: ConnectionSource,
  overrides: (body: GraphQLRequestBody) => GraphQLResult | null = () => null,
) => {
  const fetchMock = stubGraphQL((body) => overrides(body) ?? anonymousSession())
  renderWithProviders(<ConnectionCard source={source} />, '/connect')
  return fetchMock
}

const sentBodies = (fetchMock: ReturnType<typeof stubGraphQL>) =>
  fetchMock.mock.calls.map((call) => String(call[1]?.body))

describe('ConnectionCard', () => {
  it('shows no status badge on any state', () => {
    renderCard(github())

    expect(screen.queryByText('Não conectado')).not.toBeInTheDocument()
    expect(screen.queryByText('Conectado')).not.toBeInTheDocument()
  })

  it('keeps an available source collapsed until it is asked for details', async () => {
    const user = userEvent.setup()
    renderCard(github())

    expect(screen.queryByText('Somente leitura, sempre.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Detalhes' }))

    expect(screen.getByText('Somente leitura, sempre.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument()
  })

  it('sends the reader to the authorize url the BFF returned', async () => {
    const user = userEvent.setup()
    const assign = vi.fn()
    vi.stubGlobal('location', { ...window.location, assign })
    const fetchMock = renderCard(github(), (body) =>
      body.query.includes('ConnectProvider')
        ? { data: { connectProvider: { authorizeUrl: 'https://github.com/login/oauth' } } }
        : null,
    )

    await user.click(screen.getByRole('button', { name: 'Detalhes' }))
    await user.click(screen.getByRole('button', { name: 'Conectar GitHub' }))

    await waitFor(() => expect(assign).toHaveBeenCalledWith('https://github.com/login/oauth'))
    expect(sentBodies(fetchMock).some((body) => body.includes('"provider":"GITHUB"'))).toBe(true)
  })

  it('reports a refused connection instead of failing silently', async () => {
    const user = userEvent.setup()
    renderCard(github(), (body) =>
      body.query.includes('ConnectProvider')
        ? { errors: [{ message: 'nope', extensions: { code: 'PROVIDER_ERROR' } }] }
        : null,
    )

    await user.click(screen.getByRole('button', { name: 'Detalhes' }))
    await user.click(screen.getByRole('button', { name: 'Conectar GitHub' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('O GitHub recusou a operação.')
  })

  it('announces the connected account and offers to disconnect', async () => {
    const user = userEvent.setup()
    renderCard(connected())

    expect(screen.getByText('@octocat')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Detalhes' }))

    expect(screen.getByRole('button', { name: 'Desconectar GitHub' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Conectar GitHub' })).not.toBeInTheDocument()
  })

  it('only disconnects once the confirmation is accepted', async () => {
    const user = userEvent.setup()
    const fetchMock = renderCard(connected(), (body) =>
      body.query.includes('DisconnectProvider') ? { data: { disconnectProvider: true } } : null,
    )

    await user.click(screen.getByRole('button', { name: 'Detalhes' }))
    await user.click(screen.getByRole('button', { name: 'Desconectar GitHub' }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(sentBodies(fetchMock).some((body) => body.includes('DisconnectProvider'))).toBe(false)

    await user.click(screen.getByRole('button', { name: 'Desconectar' }))

    await waitFor(() =>
      expect(sentBodies(fetchMock).some((body) => body.includes('"connectionId":"conn-1"'))).toBe(
        true,
      ),
    )
  })

  it('closes the confirmation without disconnecting when it is dismissed', async () => {
    const user = userEvent.setup()
    const fetchMock = renderCard(connected())

    await user.click(screen.getByRole('button', { name: 'Detalhes' }))
    await user.click(screen.getByRole('button', { name: 'Desconectar GitHub' }))
    await user.click(await screen.findByRole('button', { name: 'Cancelar' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(sentBodies(fetchMock).some((body) => body.includes('DisconnectProvider'))).toBe(false)
  })

  it('asks to reconnect when the stored authorization is no longer valid', async () => {
    const user = userEvent.setup()
    renderCard(connected('ERROR'))

    await user.click(screen.getByRole('button', { name: 'Detalhes' }))

    expect(screen.getByRole('button', { name: 'Reconectar GitHub' })).toBeInTheDocument()
    expect(screen.getByText(/A autorização do GitHub não vale mais/)).toBeInTheDocument()
  })

  it('locks a source that is not available yet', () => {
    renderCard(jira)

    expect(screen.getByRole('button', { name: 'Detalhes' })).toBeDisabled()
  })
})
