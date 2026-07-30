import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { authenticatedSession, githubConnection, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { contentItems } from '../ContentOptions/contents'
import { tones } from '../TonePicker/tones'
import { GenerateForm } from '.'


afterEach(() => {
  vi.unstubAllGlobals()
})

const renderForm = (connections: unknown[] = []) => {
  stubGraphQL(authenticatedSession(connections))
  renderWithProviders(<GenerateForm />, '/generate')
}

describe('GenerateForm', () => {
  it('starts on the period that continues the last chapter', () => {
    renderForm()

    expect(screen.getByRole('button', { name: 'Desde o último capítulo' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('moves the selection to the period the reader picks', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('button', { name: 'Ontem' }))

    expect(screen.getByRole('button', { name: 'Ontem' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Desde o último capítulo' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('asks for the exact dates only on a custom period', async () => {
    const user = userEvent.setup()
    renderForm()

    expect(screen.queryByLabelText('De')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Personalizado' }))

    expect(screen.getByLabelText('De')).toBeInTheDocument()
    expect(screen.getByLabelText('Até')).toBeInTheDocument()
  })

  it('labels every free item as included and every Pro item as locked', () => {
    renderForm()

    const free = contentItems.filter((item) => !item.pro)
    const locked = contentItems.filter((item) => item.pro)

    contentItems.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument()
    })
    expect(screen.getAllByText('Incluído')).toHaveLength(free.length)
    expect(screen.getAllByText('Bloqueado')).toHaveLength(locked.length)
    expect(screen.queryByText('Sempre incluído')).not.toBeInTheDocument()
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

  it('refuses a chapter with no source behind it', async () => {
    const user = userEvent.setup()
    renderForm([githubConnection])

    const github = await screen.findByRole('button', { name: 'GitHub' })
    await waitFor(() => expect(github).toBeEnabled())
    await user.click(github)
    await user.click(github)
    await user.click(screen.getByRole('button', { name: 'Ontem' }))

    expect(await screen.findByText('Escolha ao menos uma fonte.')).toBeInTheDocument()
  })

  it('presents the tone and the story adjustment as locked Pro features', () => {
    renderForm()

    tones.forEach((tone) => {
      expect(screen.getByRole('button', { name: tone })).toBeDisabled()
    })
    expect(screen.getByLabelText('Ajuste a história')).toBeDisabled()
  })

  it('cannot be submitted while generation does not exist', () => {
    renderForm()

    expect(screen.getByRole('button', { name: 'Gerar minha história →' })).toBeDisabled()
    expect(
      screen.getByText('A geração de capítulos ainda não está disponível nesta versão.'),
    ).toBeInTheDocument()
  })
})
