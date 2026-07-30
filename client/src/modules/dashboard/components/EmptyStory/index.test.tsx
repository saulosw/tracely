import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { anonymousSession, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { steps } from '../StorySteps/steps'
import { EmptyStory } from '.'


afterEach(() => {
  vi.unstubAllGlobals()
})

const renderStory = (firstName?: string) => {
  stubGraphQL(() => anonymousSession())
  renderWithProviders(<EmptyStory firstName={firstName} />, '/connect')
}

describe('EmptyStory', () => {
  it('greets the reader by name', () => {
    renderStory('Alex')

    expect(
      screen.getByRole('heading', { name: 'Alex, sua história ainda não começou.' }),
    ).toBeInTheDocument()
  })

  it('falls back to a nameless greeting when the user is unknown', () => {
    renderStory()

    expect(
      screen.getByRole('heading', { name: 'Sua história ainda não começou.' }),
    ).toBeInTheDocument()
  })

  it('points the first action at the connections screen', () => {
    renderStory('Alex')

    expect(
      screen.getByRole('link', { name: 'Conectar uma fonte para começar →' }),
    ).toHaveAttribute('href', '/connect')
  })

  it('walks through every step of the first chapter', () => {
    renderStory('Alex')

    steps.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument()
    })
  })
})
