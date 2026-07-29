import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { anonymousSession, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { PageHeader } from '.'


afterEach(() => {
  vi.unstubAllGlobals()
})

describe('PageHeader', () => {
  it('announces the page through a heading and supports it with the subtitle', () => {
    stubGraphQL(() => anonymousSession())
    renderWithProviders(<PageHeader title="Suas conexões" subtitle="Cada fonte é um fio." />)

    expect(screen.getByRole('heading', { name: 'Suas conexões' })).toBeInTheDocument()
    expect(screen.getByText('Cada fonte é um fio.')).toBeInTheDocument()
  })
})
