import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router'

import { useConnectionSources } from '@/modules/connections'
import { SourceChip, SourceError, SourceNote, SourceRow } from './styles'


type SourcePickerProps = {
  value: string[]
  onChange: (sources: string[]) => void
  onBlur: () => void
  error?: string
}

export function SourcePicker({ value, onChange, onBlur, error }: SourcePickerProps) {
  const sources = useConnectionSources()
  const hasConnection = sources.some((source) => source.state === 'connected')

  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((current) => current !== id) : [...value, id])


  return (
    <>
      <SourceRow>
        {sources.map((source) => {
          const locked = source.state === 'unavailable'
          const selected = !locked && value.includes(source.id)

          return (
            <SourceChip
              key={source.id}
              selected={selected}
              disabled={locked}
              aria-pressed={selected}
              onClick={() => toggle(source.id)}
              onBlur={onBlur}
            >
              {source.name}
            </SourceChip>
          )
        })}
      </SourceRow>

      {error ? <SourceError variant="fine">{error}</SourceError> : null}

      {hasConnection ? null : (
        <SourceNote variant="fine">
          Nenhuma fonte conectada ainda —{' '}
          <Link component={RouterLink} to="/connect">
            conecte o GitHub
          </Link>{' '}
          para que haja atividade a contar.
        </SourceNote>
      )}
    </>
  )
}
