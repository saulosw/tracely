import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { authenticatedSession, githubConnection, journalArtifactPayload, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { toneOptions } from '../TonePicker/tones'
import { JournalForm } from '.'

import type { GraphQLRequestBody } from '@/test/graphql'


afterEach(() => {
  vi.unstubAllGlobals()
})

const renderForm = (connections: unknown[] = [], responses: Record<string, unknown> = {}) => {
  const fetchMock = stubGraphQL(authenticatedSession(connections, responses))
  renderWithProviders(<JournalForm />, '/artifacts/journal')
  return fetchMock
}

const selectGithub = async (user: ReturnType<typeof userEvent.setup>) => {
  const github = await screen.findByRole('button', { name: 'GitHub' })
  await waitFor(() => expect(github).toBeEnabled())
  await user.click(github)
}

const openCalendar = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Personalizado' }))
  await user.click(screen.getByRole('button', { name: /Período personalizado/ }))
  return screen.getByRole('dialog', { name: 'Período personalizado' })
}

const dayAt = (calendar: HTMLElement, index: number) =>
  within(calendar).getAllByRole('button', { name: /^\d+ de / })[index]

describe('JournalForm', () => {
  it('starts on the current week', () => {
    renderForm()

    expect(screen.getByRole('button', { name: 'Esta semana' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('shows the whole year as a locked Pro period', () => {
    renderForm()

    expect(screen.getByRole('button', { name: /Este ano/ })).toBeDisabled()
  })

  it('offers the tones but holds every one of them back for Pro', () => {
    renderForm()

    toneOptions.forEach((tone) => {
      expect(screen.getByRole('button', { name: new RegExp(tone.label) })).toBeDisabled()
    })
  })

  it('never offers a day that would stretch the custom range past the limit', async () => {
    const user = userEvent.setup()
    renderForm([githubConnection])

    const calendar = await openCalendar(user)
    await user.click(dayAt(calendar, 0))
    await user.click(within(calendar).getByRole('button', { name: 'Próximo mês' }))
    await user.click(within(calendar).getByRole('button', { name: 'Próximo mês' }))

    expect(dayAt(calendar, 0)).toBeDisabled()
  })

  it('asks for the dates the reader picked on a custom period', async () => {
    const user = userEvent.setup()
    const fetchMock = renderForm([githubConnection], {
      GenerateJournal: { generateJournal: journalArtifactPayload },
      TriggerSync: { triggerSync: { id: 'run-1', status: 'SUCCEEDED' } },
    })

    const calendar = await openCalendar(user)
    await user.click(dayAt(calendar, 0))
    await user.click(dayAt(calendar, 1))
    await selectGithub(user)
    await user.click(screen.getByRole('button', { name: /Gerar meu diário/ }))

    await waitFor(() => {
      const sent = fetchMock.mock.calls
        .map(([, init]) => JSON.parse(String(init?.body)) as GraphQLRequestBody)
        .find((body) => body.query.includes('GenerateJournal'))

      expect(sent?.variables?.input).toMatchObject({ period: 'CUSTOM' })
      expect(sent?.variables?.input).toHaveProperty('from', expect.stringMatching(/-01$/))
      expect(sent?.variables?.input).toHaveProperty('to', expect.stringMatching(/-02$/))
    })
  })

  it('refuses a custom period with no dates behind it', async () => {
    const user = userEvent.setup()
    renderForm([githubConnection])

    await user.click(screen.getByRole('button', { name: 'Personalizado' }))
    await selectGithub(user)
    await user.click(screen.getByRole('button', { name: /Gerar meu diário/ }))

    expect(await screen.findByText('Informe a data inicial.')).toBeInTheDocument()
  })

  it('refuses to read a period with no source behind it', async () => {
    const user = userEvent.setup()
    renderForm([githubConnection])

    await user.click(screen.getByRole('button', { name: /Gerar meu diário/ }))

    expect(await screen.findByText('Escolha ao menos uma fonte.')).toBeInTheDocument()
  })

  it('asks for the journal with the choices the reader made, and nothing about tone', async () => {
    const user = userEvent.setup()
    const fetchMock = renderForm([githubConnection], {
      GenerateJournal: { generateJournal: journalArtifactPayload },
      TriggerSync: { triggerSync: { id: 'run-1', status: 'SUCCEEDED' } },
    })

    await selectGithub(user)
    await user.click(screen.getByRole('button', { name: /Gerar meu diário/ }))

    await waitFor(() => {
      const sent = fetchMock.mock.calls
        .map(([, init]) => JSON.parse(String(init?.body)) as GraphQLRequestBody)
        .find((body) => body.query.includes('GenerateJournal'))

      expect(sent?.variables?.input).toMatchObject({
        period: 'WEEK',
        providers: ['GITHUB'],
      })
      expect(sent?.variables?.input).not.toHaveProperty('tone')
    })
  })

  it('says what went wrong instead of leaving the reader waiting', async () => {
    const user = userEvent.setup()
    const session = authenticatedSession([githubConnection])
    stubGraphQL((body) =>
      body.query.includes('GenerateJournal')
        ? { errors: [{ message: 'boom', extensions: { code: 'INTERNAL_SERVER_ERROR' } }] }
        : session(body),
    )
    renderWithProviders(<JournalForm />, '/artifacts/journal')

    await selectGithub(user)
    await user.click(screen.getByRole('button', { name: /Gerar meu diário/ }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Algo deu errado por aqui. Tente novamente em instantes.',
    )
  })
})
