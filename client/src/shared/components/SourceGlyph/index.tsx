import { sourcePaths } from './paths'
import { Glyph } from './styles'

import type { SourceId } from './paths'


type SourceGlyphProps = {
  source: SourceId
  label: string
}

export function SourceGlyph({ source, label }: SourceGlyphProps) {
  return (
    <Glyph viewBox="0 0 24 24" role="img" aria-label={label}>
      <path d={sourcePaths[source]} />
    </Glyph>
  )
}

export type { SourceId }
