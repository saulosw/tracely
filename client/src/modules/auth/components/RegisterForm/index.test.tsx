import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { anonymousSession, authenticatedUser, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { RegisterForm } from '.'

import type { GraphQLRequestBody, GraphQLResult } from '@/test/graphql'


afterEach(() => {
  vi.unstubAllGlobals()
})

const renderRegister = (
  onRegister: (body: GraphQLRequestBody) => GraphQLResult | Promise<GraphQLResult>,
) => {
  const fetchMock = stubGraphQL((body) =>
    body.query.includes('mutation Register') ? onRegister(body) : anonymousSession(),
  )
  renderWithProviders(<RegisterForm />, '/register')
  return fetchMock
}

const fillForm = async (
  user: ReturnType<typeof userEvent.setup>,
  { confirmPassword = 'S3nha!forte' } = {},
) => {
  await user.type(screen.getByLabelText('Primeiro nome'), 'Alex')
  await user.type(screen.getByLabelText('E-mail'), 'alex@exemplo.com')
  await user.type(screen.getByLabelText('Senha'), 'S3nha!forte')
  await user.type(screen.getByLabelText('Confirmar senha'), confirmPassword)
}

describe('RegisterForm', () => {
  it('refuses a confirmation that does not match the password', async () => {
    const user = userEvent.setup()
    const fetchMock = renderRegister(() => ({ data: { register: { user: authenticatedUser } } }))

    await fillForm(user, { confirmPassword: 'S3nha!outra' })
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(await screen.findByText('As senhas não coincidem.')).toBeInTheDocument()
    expect(
      fetchMock.mock.calls.some(([, init]) => String(init?.body).includes('mutation Register')),
    ).toBe(false)
  })

  it('registers with the fields the backend expects and enters the app', async () => {
    const user = userEvent.setup()
    const fetchMock = renderRegister(() => ({ data: { register: { user: authenticatedUser } } }))

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(await screen.findByText('painel')).toBeInTheDocument()

    const registerCall = fetchMock.mock.calls.find(([, init]) =>
      String(init?.body).includes('mutation Register'),
    )
    expect(JSON.parse(String(registerCall?.[1]?.body)).variables).toEqual({
      input: {
        firstName: 'Alex',
        email: 'alex@exemplo.com',
        password: 'S3nha!forte',
      },
    })
  })

  it('points a duplicate account at the email field', async () => {
    const user = userEvent.setup()
    renderRegister(() => ({
      data: null,
      errors: [{ message: 'Email is already registered', extensions: { code: 'CONFLICT' } }],
    }))

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(await screen.findByText('Este e-mail já está cadastrado.')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.queryByText('painel')).not.toBeInTheDocument()
  })
})
