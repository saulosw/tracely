import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { authenticatedSession, journalSummaryPayload, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { ArtifactLibraryPage } from '.'

import type { GraphQLRequestBody } from '@/test/graphql'


afterEach(() => {
  vi.unstubAllGlobals()
})

const olderJournal = {
  ...journalSummaryPayload,
  id: 'artifact-0',
  generatedAt: '2026-07-20T12:00:00.000Z',
}

const renderPage = (items: unknown[] = [], nextCursor: string | null = null) => {
  const fetchMock = stubGraphQL(
    authenticatedSession([], { ArtifactLibrary: { artifacts: { items, nextCursor } } }),
  )
  renderWithProviders(<ArtifactLibraryPage />, '/artifacts/library')
  return fetchMock
}

describe('ArtifactLibraryPage', () => {
  it('opens with the page header', async () => {
    renderPage()

    expect(await screen.findByRole('heading', { name: 'Meus artefatos' })).toBeInTheDocument()
  })

  it('invites the reader to generate something when there is nothing yet', async () => {
    renderPage()

    expect(await screen.findByText('Nenhum artefato ainda')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Gerar meu primeiro artefato/ })).toHaveAttribute(
      'href',
      '/artifacts',
    )
  })

  it('gathers the artifacts under the category they belong to', async () => {
    renderPage([journalSummaryPayload])

    const journals = await screen.findByRole('region', { name: 'Diário' })

    expect(within(journals).getByRole('link')).toHaveAttribute(
      'href',
      '/artifacts/journal/artifact-1',
    )
    expect(screen.queryByRole('region', { name: 'Insights' })).not.toBeInTheDocument()
  })

  it('keeps the newest artifact at the top of its category', async () => {
    renderPage([journalSummaryPayload, olderJournal])

    const journals = await screen.findByRole('region', { name: 'Diário' })

    expect(within(journals).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      '/artifacts/journal/artifact-1',
      '/artifacts/journal/artifact-0',
    ])
  })

  it('reaches for the next page with the cursor the server handed back', async () => {
    const user = userEvent.setup()
    const fetchMock = renderPage([journalSummaryPayload], 'cursor-1')

    await user.click(await screen.findByRole('button', { name: 'Carregar mais' }))

    const cursors = fetchMock.mock.calls
      .map(([, init]) => JSON.parse(String(init?.body)) as GraphQLRequestBody)
      .filter((body) => body.query.includes('ArtifactLibrary'))
      .map((body) => body.variables?.after)

    expect(cursors).toEqual([null, 'cursor-1'])
  })

  it('says what went wrong instead of leaving the reader waiting', async () => {
    const session = authenticatedSession()
    stubGraphQL((body) =>
      body.query.includes('ArtifactLibrary')
        ? { errors: [{ message: 'boom', extensions: { code: 'INTERNAL_SERVER_ERROR' } }] }
        : session(body),
    )
    renderWithProviders(<ArtifactLibraryPage />, '/artifacts/library')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Algo deu errado por aqui. Tente novamente em instantes.',
    )
  })
})
