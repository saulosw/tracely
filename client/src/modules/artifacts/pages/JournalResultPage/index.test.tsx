import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { authenticatedSession, journalArtifactPayload, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { JournalResultPage } from '.'

import type { GraphQLRequestBody } from '@/test/graphql'


afterEach(() => {
  vi.unstubAllGlobals()
})

const renderPage = (artifact: unknown = journalArtifactPayload, extra: Record<string, unknown> = {}) => {
  const fetchMock = stubGraphQL(
    authenticatedSession([], { JournalArtifact: { artifact }, ...extra }),
  )
  renderWithProviders(
    <JournalResultPage />,
    '/artifacts/journal/artifact-1',
    '/artifacts/journal/:id',
  )
  return fetchMock
}

describe('JournalResultPage', () => {
  it('names the period it covers', async () => {
    renderPage()

    expect(
      await screen.findByRole('heading', { name: '27 de julho de 2026 — 2 de agosto de 2026' }),
    ).toBeInTheDocument()
  })

  it('says the journal was captured, not written', async () => {
    renderPage()

    expect(
      await screen.findByText('Registrado automaticamente — fatos, datas e fontes. Nada escrito à mão.'),
    ).toBeInTheDocument()
  })

  it('names the sources the journal was built from', async () => {
    renderPage()

    expect(await screen.findByText('Construído a partir de')).toBeInTheDocument()
    expect(screen.getByText('GITHUB')).toBeInTheDocument()
  })

  it('lays the activity out day by day', async () => {
    renderPage()

    expect(await screen.findByText(/Mergeou a PR #501 — nova camada de dispatch/)).toBeInTheDocument()
    expect(screen.getByText(/6 commits/)).toBeInTheDocument()
    expect(screen.getByText('e mais 3 atividades')).toBeInTheDocument()
  })

  it('counts the entries and the sources at the foot', async () => {
    renderPage()

    expect(await screen.findByText(/6 entradas · 1 fontes/)).toBeInTheDocument()
  })

  it('opens a grouped line into the commits it stands for', async () => {
    const user = userEvent.setup()
    renderPage()

    const grouped = await screen.findByRole('button', { name: /6 commits/ })
    expect(grouped).toHaveAttribute('aria-expanded', 'false')

    await user.click(grouped)

    expect(grouped).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByRole('link', { name: 'ajusta o retry do dispatch' }),
    ).toHaveAttribute('href', 'https://github.com/octocat/hello-world/commit/aaa')
    expect(screen.getByText('e mais 4, não listadas aqui')).toBeInTheDocument()
  })

  it('lists the earlier versions and links back to them', async () => {
    renderPage()

    expect(await screen.findByText('Versão atual')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /v1/ })).toHaveAttribute(
      'href',
      '/artifacts/journal/artifact-0',
    )
  })

  it('sends the reader to the journal it just regenerated', async () => {
    const user = userEvent.setup()
    const fetchMock = renderPage(journalArtifactPayload, {
      RegenerateJournal: {
        regenerateArtifact: { ...journalArtifactPayload, id: 'artifact-2' },
      },
    })

    await user.click(await screen.findByRole('button', { name: 'Gerar novamente' }))

    await waitFor(() => {
      const read = fetchMock.mock.calls
        .map(([, init]) => JSON.parse(String(init?.body)) as GraphQLRequestBody)
        .filter((body) => body.query.includes('JournalArtifact'))
        .map((body) => body.variables?.id)

      expect(read).toContain('artifact-2')
    })
  })

  it('explains an empty period instead of showing a bare page', async () => {
    renderPage({
      ...journalArtifactPayload,
      activityCount: 0,
      journal: { ...journalArtifactPayload.journal, activityCount: 0, sections: [] },
    })

    expect(await screen.findByText(/Nenhuma atividade registrada nesse período/)).toBeInTheDocument()
  })

  it('says when the journal could not be read', async () => {
    const session = authenticatedSession([])
    stubGraphQL((body) =>
      body.query.includes('JournalArtifact')
        ? { errors: [{ message: 'gone', extensions: { code: 'NOT_FOUND' } }] }
        : session(body),
    )
    renderWithProviders(
      <JournalResultPage />,
      '/artifacts/journal/artifact-1',
      '/artifacts/journal/:id',
    )

    expect(await screen.findByRole('alert')).toHaveTextContent('Esse diário não existe mais.')
  })
})
