import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { authenticatedSession, githubConnection, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { categoryOptions } from '../CategoryPicker/categories'
import { InsightsForm } from '.'


afterEach(() => {
  vi.unstubAllGlobals()
})

const renderForm = (connections: unknown[] = []) => {
  stubGraphQL(authenticatedSession(connections))
  renderWithProviders(<InsightsForm />, '/artifacts/insights')
}

const fillCustomRange = async (
  user: ReturnType<typeof userEvent.setup>,
  from: string,
  to: string,
) => {
  await user.click(screen.getByRole('button', { name: 'Personalizado' }))
  await user.type(screen.getByLabelText('De'), from)
  await user.type(screen.getByLabelText('Até'), to)
  await user.tab()
}

describe('InsightsForm', () => {
  it('starts on the current week', () => {
    renderForm()

    expect(screen.getByRole('button', { name: 'Esta semana' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('moves the selection to the period the reader picks', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('button', { name: 'Ontem' }))

    expect(screen.getByRole('button', { name: 'Ontem' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Esta semana' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('shows the whole year as a locked Pro period', () => {
    renderForm()

    expect(screen.getByRole('button', { name: /Este ano/ })).toBeDisabled()
    expect(screen.getByText('Pro')).toBeInTheDocument()
  })

  it('asks for the exact dates only on a custom period', async () => {
    const user = userEvent.setup()
    renderForm()

    expect(screen.queryByLabelText('De')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Personalizado' }))

    expect(screen.getByLabelText('De')).toBeInTheDocument()
    expect(screen.getByLabelText('Até')).toBeInTheDocument()
  })

  it('refuses a custom range longer than one month', async () => {
    const user = userEvent.setup()
    renderForm()

    await fillCustomRange(user, '2026-03-01', '2026-05-10')

    expect(
      await screen.findByText('O intervalo personalizado não pode passar de um mês.'),
    ).toBeInTheDocument()
  })

  it('lets the range through once it fits in a month', async () => {
    const user = userEvent.setup()
    renderForm()

    await fillCustomRange(user, '2026-03-01', '2026-05-10')
    await screen.findByText('O intervalo personalizado não pode passar de um mês.')

    await user.clear(screen.getByLabelText('Até'))
    await user.type(screen.getByLabelText('Até'), '2026-03-31')
    await user.tab()

    await waitFor(() =>
      expect(
        screen.queryByText('O intervalo personalizado não pode passar de um mês.'),
      ).not.toBeInTheDocument(),
    )
  })

  it('keeps every source out of reach while nothing is connected', async () => {
    renderForm()

    expect(await screen.findByRole('button', { name: 'GitHub' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Jira' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Obsidian' })).toBeDisabled()
    expect(screen.getByText(/Nenhuma fonte conectada ainda/)).toBeInTheDocument()
  })

  it('opens up GitHub once the account is connected', async () => {
    renderForm([githubConnection])

    await waitFor(() => expect(screen.getByRole('button', { name: 'GitHub' })).toBeEnabled())
    expect(screen.queryByText(/Nenhuma fonte conectada ainda/)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Jira' })).toBeDisabled()
  })

  it('holds back the bulk selection while a single source is connected', async () => {
    renderForm([githubConnection])

    await waitFor(() => expect(screen.getByRole('button', { name: 'GitHub' })).toBeEnabled())
    expect(screen.queryByRole('button', { name: 'Selecionar todas' })).not.toBeInTheDocument()
  })

  it('refuses an insight with no source behind it', async () => {
    const user = userEvent.setup()
    renderForm([githubConnection])

    const github = await screen.findByRole('button', { name: 'GitHub' })
    await waitFor(() => expect(github).toBeEnabled())
    await user.click(github)
    await user.click(github)
    await user.click(screen.getByRole('button', { name: 'Ontem' }))

    expect(await screen.findByText('Escolha ao menos uma fonte.')).toBeInTheDocument()
  })

  it('counts every category in until the reader drops one', async () => {
    const user = userEvent.setup()
    renderForm()

    categoryOptions.forEach(({ label }) => {
      expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true')
    })

    await user.click(screen.getByRole('button', { name: 'Branches' }))

    expect(screen.getByRole('button', { name: 'Branches' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('refuses an insight with nothing left to measure', async () => {
    const user = userEvent.setup()
    renderForm()

    for (const { label } of categoryOptions) {
      await user.click(screen.getByRole('button', { name: label }))
    }

    expect(await screen.findByText('Escolha ao menos uma categoria.')).toBeInTheDocument()
  })

  it('cannot be submitted while generation does not exist', () => {
    renderForm()

    expect(screen.getByRole('button', { name: 'Gerar meus insights →' })).toBeDisabled()
    expect(
      screen.getByText('A geração de insights ainda não está disponível nesta versão.'),
    ).toBeInTheDocument()
  })
})
