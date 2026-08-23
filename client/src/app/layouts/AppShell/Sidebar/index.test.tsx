import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { authenticatedSession, authenticatedUser, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { navItems } from './navItems'
import { Sidebar } from '.'

import type { NavLeafDefinition } from './navItems'


afterEach(() => {
  vi.unstubAllGlobals()
})

const accountLabel = `Conta de ${authenticatedUser.firstName}`

const renderSidebar = () => {
  const session = authenticatedSession()
  const fetchMock = stubGraphQL((body) =>
    body.query.includes('mutation Logout') ? { data: { logout: true } } : session(body),
  )
  renderWithProviders(<Sidebar />, '/connect')
  return fetchMock
}

describe('Sidebar', () => {
  it('lists every reachable destination in the declared order', () => {
    renderSidebar()

    const reachable = navItems.filter(
      (item): item is NavLeafDefinition => 'to' in item && !item.disabled,
    )

    expect(navItems.map(({ label }) => label)).toEqual([
      'Início',
      'Conexões',
      'Artefatos',
      'Agendamentos',
    ])
    reachable.forEach(({ label, to }) => {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', to)
    })
  })

  it('keeps the artifact destinations folded away until "Artefatos" is opened', async () => {
    const user = userEvent.setup()
    renderSidebar()

    const artifacts = screen.getByRole('button', { name: 'Artefatos' })

    expect(artifacts).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: 'Meus artefatos' })).not.toBeInTheDocument()

    await user.click(artifacts)

    expect(artifacts).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'Artefatos' })).toHaveAttribute('href', '/artifacts')
    expect(screen.getByRole('link', { name: 'Meus artefatos' })).toHaveAttribute(
      'href',
      '/artifacts/library',
    )
  })

  it('opens "Artefatos" on its own when the reader is already inside it', () => {
    const session = authenticatedSession()
    stubGraphQL((body) => session(body))
    renderWithProviders(<Sidebar />, '/artifacts/library')

    expect(screen.getByRole('button', { name: 'Artefatos' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('link', { name: 'Meus artefatos' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('shows "Agendamentos" without letting anyone through yet', () => {
    renderSidebar()

    expect(screen.queryByRole('link', { name: 'Agendamentos' })).not.toBeInTheDocument()
    expect(screen.getByText('Agendamentos')).toBeInTheDocument()
  })

  it('sends "Novo artefato" to the artifacts screen', () => {
    renderSidebar()

    expect(screen.getByRole('link', { name: '+ Novo artefato' })).toHaveAttribute(
      'href',
      '/artifacts',
    )
  })

  it('identifies the signed-in user by name, e-mail and initial', async () => {
    renderSidebar()

    expect(await screen.findByText(authenticatedUser.firstName)).toBeInTheDocument()
    expect(screen.getByText(authenticatedUser.email)).toBeInTheDocument()
    expect(screen.getByText(authenticatedUser.firstName.charAt(0))).toBeInTheDocument()
  })

  it('keeps the account menu closed until the account is clicked', async () => {
    const user = userEvent.setup()
    renderSidebar()

    expect(screen.queryByRole('menuitem', { name: 'Sair' })).not.toBeInTheDocument()

    await user.click(await screen.findByRole('button', { name: accountLabel }))

    expect(screen.getByRole('menuitem', { name: 'Sair' })).toBeInTheDocument()
  })

  it('ends the session through the existing auth flow', async () => {
    const user = userEvent.setup()
    const fetchMock = renderSidebar()

    await user.click(await screen.findByRole('button', { name: accountLabel }))
    await user.click(screen.getByRole('menuitem', { name: 'Sair' }))

    await waitFor(() =>
      expect(
        fetchMock.mock.calls.some(([, init]) => String(init?.body).includes('mutation Logout')),
      ).toBe(true),
    )
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: accountLabel })).not.toBeInTheDocument(),
    )
  })
})
