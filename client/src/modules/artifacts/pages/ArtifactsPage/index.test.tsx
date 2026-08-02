import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { anonymousSession, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { artifacts } from '../../artifacts'
import { ArtifactsPage } from '.'


afterEach(() => {
  vi.unstubAllGlobals()
})

const renderPage = () => {
  stubGraphQL(() => anonymousSession())
  renderWithProviders(<ArtifactsPage />, '/artifacts')
}

describe('ArtifactsPage', () => {
  it('opens with the page header', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'O que você deseja gerar?' })).toBeInTheDocument()
  })

  it('offers the artifacts in the order the product tells them', () => {
    renderPage()

    const names = artifacts.map(({ name }) => name)

    expect(names).toEqual(['Insights', 'Storytelling', 'Diário'])
    names.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument()
    })
  })

  it('sends the reader to the insights form and holds the rest back', () => {
    renderPage()

    expect(screen.getByRole('link', { name: /Insights/ })).toHaveAttribute(
      'href',
      '/artifacts/insights',
    )
    expect(screen.queryByRole('link', { name: /Storytelling/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Diário/ })).not.toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })
})
