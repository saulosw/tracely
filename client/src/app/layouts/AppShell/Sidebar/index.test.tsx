import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { authenticatedSession, authenticatedUser, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { navItems } from './navItems'
import { Sidebar } from '.'


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
  it('lists every declared destination and no longer offers "Gerar"', () => {
    renderSidebar()

    navItems.forEach(({ label }) => {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    })
    expect(screen.queryByRole('link', { name: 'Gerar' })).not.toBeInTheDocument()
  })

  it('sends "Novo capítulo" to the generate screen', () => {
    renderSidebar()

    expect(screen.getByRole('link', { name: '+ Novo capítulo' })).toHaveAttribute(
      'href',
      '/generate',
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
