import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { anonymousSession, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { sources } from './sources'
import { SourceRail } from '.'


afterEach(() => {
  vi.unstubAllGlobals()
})

const renderRail = () => {
  stubGraphQL(() => anonymousSession())
  renderWithProviders(<SourceRail />, '/register')
}

describe('SourceRail', () => {
  it('says what the rail is showing', () => {
    renderRail()

    expect(screen.getByText('Lê de onde você já trabalha')).toBeInTheDocument()
  })

  it('renders one node per declared source', () => {
    renderRail()

    expect(screen.getAllByRole('listitem')).toHaveLength(sources.length)
  })

  it('names every source it puts on the rail', () => {
    renderRail()

    sources.forEach(({ label }) => {
      expect(screen.getByRole('img', { name: label })).toBeInTheDocument()
    })
  })
})
