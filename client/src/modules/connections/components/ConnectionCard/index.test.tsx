import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { anonymousSession, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { ConnectionCard } from '.'

import type { ConnectionSource } from '../../types'


afterEach(() => {
  vi.unstubAllGlobals()
})

const github: ConnectionSource = {
  id: 'github',
  name: 'GitHub',
  description: 'Lê commits e pull requests.',
  state: 'disconnected',
  detail: 'Somente leitura, sempre.',
}

const jira: ConnectionSource = {
  id: 'jira',
  name: 'Jira',
  description: 'Traz issues e sprints.',
  state: 'unavailable',
}

const renderCard = (source: ConnectionSource) => {
  stubGraphQL(() => anonymousSession())
  renderWithProviders(<ConnectionCard source={source} />, '/connect')
}

describe('ConnectionCard', () => {
  it('keeps an available source collapsed until it is asked for details', async () => {
    const user = userEvent.setup()
    renderCard(github)

    expect(screen.queryByText('Somente leitura, sempre.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Detalhes' }))

    expect(screen.getByText('Somente leitura, sempre.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument()
  })

  it('offers no working connect action while the flow is not wired', async () => {
    const user = userEvent.setup()
    renderCard(github)

    await user.click(screen.getByRole('button', { name: 'Detalhes' }))

    expect(screen.getByRole('button', { name: 'Conectar GitHub' })).toBeDisabled()
  })

  it('locks a source that is not available yet', () => {
    renderCard(jira)

    expect(screen.getByText('Em breve')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Detalhes' })).toBeDisabled()
  })
})
