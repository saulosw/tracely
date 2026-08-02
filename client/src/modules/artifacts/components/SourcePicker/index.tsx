import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router'

import { useConnectionSources } from '@/modules/connections'
import { SourceGlyph } from '@/shared/components/SourceGlyph'
import { SelectAll, SourceCard, SourceError, SourceNote, SourceRow } from './styles'


type SourcePickerProps = {
  value: string[]
  onChange: (sources: string[]) => void
  onBlur: () => void
  error?: string
}

export function SourcePicker({ value, onChange, onBlur, error }: SourcePickerProps) {
  const sources = useConnectionSources()
  const connected = sources.filter((source) => source.state === 'connected')
  const allSelected = connected.length > 0 && connected.every((source) => value.includes(source.id))

  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((current) => current !== id) : [...value, id])


  return (
    <>
      <SourceRow>
        {sources.map((source) => {
          const locked = source.state !== 'connected'
          const selected = !locked && value.includes(source.id)

          return (
            <SourceCard
              key={source.id}
              selected={selected}
              disabled={locked}
              aria-pressed={selected}
              onClick={() => toggle(source.id)}
              onBlur={onBlur}
            >
              <SourceGlyph source={source.id} />
              {source.name}
            </SourceCard>
          )
        })}
      </SourceRow>

      {connected.length > 1 ? (
        <SelectAll onClick={() => onChange(allSelected ? [] : connected.map((source) => source.id))}>
          {allSelected ? 'Limpar seleção' : 'Selecionar todas'}
        </SelectAll>
      ) : null}

      {error ? <SourceError variant="fine">{error}</SourceError> : null}

      {connected.length ? null : (
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
