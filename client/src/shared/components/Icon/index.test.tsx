import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { iconPaths } from './paths'
import { Icon } from '.'


describe('Icon', () => {
  it('stays out of the accessibility tree when it is only decoration', () => {
    const { container } = render(<Icon name="home" />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('exposes the mark under the label it was given', () => {
    render(<Icon name="logout" label="Sair" />)

    expect(screen.getByRole('img', { name: 'Sair' })).toBeInTheDocument()
  })

  it('draws a distinct mark for every known icon', () => {
    const drawings = Object.values(iconPaths)

    expect(new Set(drawings).size).toBe(drawings.length)
    expect(drawings.every((drawing) => drawing.startsWith('M'))).toBe(true)
  })
})
