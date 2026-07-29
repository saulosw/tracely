import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { anonymousSession, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { contentItems } from '../ContentOptions/contents'
import { tones } from '../TonePicker/tones'
import { GenerateForm } from '.'


afterEach(() => {
  vi.unstubAllGlobals()
})

const renderForm = () => {
  stubGraphQL(() => anonymousSession())
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

  it('keeps sources that have no integration out of reach', () => {
    renderForm()

    expect(screen.getByRole('button', { name: 'GitHub' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Jira' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Obsidian' })).toBeDisabled()
  })

  it('refuses a chapter with no source behind it', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('button', { name: 'GitHub' }))
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
