import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { sourcePaths } from './paths'
import { SourceGlyph } from '.'


describe('SourceGlyph', () => {
  it('exposes the mark under the label it was given', () => {
    render(<SourceGlyph source="github" label="GitHub" />)

    expect(screen.getByRole('img', { name: 'GitHub' })).toBeInTheDocument()
  })

  it('draws a distinct mark for every known source', () => {
    const drawings = Object.values(sourcePaths)

    expect(new Set(drawings).size).toBe(drawings.length)
    expect(drawings.every((drawing) => drawing.startsWith('M'))).toBe(true)
  })
})
