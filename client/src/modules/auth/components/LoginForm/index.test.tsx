import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { anonymousSession, authenticatedUser, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { LoginForm } from '.'

import type { GraphQLRequestBody, GraphQLResult } from '@/test/graphql'


afterEach(() => {
  vi.unstubAllGlobals()
})

const fillCredentials = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('E-mail'), 'alex@exemplo.com')
  await user.type(screen.getByLabelText('Senha'), 'S3nha!forte')
}

const renderLogin = (onLogin: (body: GraphQLRequestBody) => GraphQLResult | Promise<GraphQLResult>) => {
  const fetchMock = stubGraphQL((body) =>
    body.query.includes('mutation Login') ? onLogin(body) : anonymousSession(),
  )
  renderWithProviders(<LoginForm />)
  return fetchMock
}

describe('LoginForm', () => {
  it('blocks the submit and reports missing fields', async () => {
    const user = userEvent.setup()
    const fetchMock = renderLogin(() => ({ data: { login: { user: authenticatedUser } } }))

    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('Informe seu e-mail.')).toBeInTheDocument()
    expect(screen.getByText('Informe sua senha.')).toBeInTheDocument()
    expect(
      fetchMock.mock.calls.some(([, init]) => String(init?.body).includes('mutation Login')),
    ).toBe(false)
  })

  it('sends the credentials through the login mutation and enters the app', async () => {
    const user = userEvent.setup()
    const fetchMock = renderLogin(() => ({ data: { login: { user: authenticatedUser } } }))

    await fillCredentials(user)
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('painel')).toBeInTheDocument()

    const loginCall = fetchMock.mock.calls.find(([, init]) =>
      String(init?.body).includes('mutation Login'),
    )
    expect(JSON.parse(String(loginCall?.[1]?.body)).variables).toEqual({
      input: { email: 'alex@exemplo.com', password: 'S3nha!forte' },
    })
  })

  it('keeps the submit disabled while the request is in flight', async () => {
    const user = userEvent.setup()
    let release: (() => void) | undefined
    renderLogin(
      () =>
        new Promise<GraphQLResult>((resolve) => {
          release = () => resolve({ data: { login: { user: authenticatedUser } } })
        }),
    )

    await fillCredentials(user)
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => expect(screen.getByRole('button', { name: 'Entrar' })).toBeDisabled())

    release?.()
    expect(await screen.findByText('painel')).toBeInTheDocument()
  })

  it('translates an authentication failure into a form-level message', async () => {
    const user = userEvent.setup()
    renderLogin(() => ({
      data: null,
      errors: [{ message: 'Invalid email or password', extensions: { code: 'UNAUTHENTICATED' } }],
    }))

    await fillCredentials(user)
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou senha incorretos.')
    expect(screen.queryByText('painel')).not.toBeInTheDocument()
  })
})
