import { StatusPill } from '@/shared/components/StatusPill'
import { TextField } from '@/shared/components/TextField'
import { suggestions } from './suggestions'
import { AdjustmentRoot, Suggestion, Suggestions } from './styles'


export function StoryAdjustment() {
  return (
    <AdjustmentRoot component="section">
      <TextField
        label="Ajuste a história"
        trailing={<StatusPill tone="pro">Pro</StatusPill>}
        placeholder="ex.: foque no que aprendi este mês, ou escreva para uma avaliação de desempenho…"
        helperText="Opcional. Direcionar a história faz parte do Tracely Pro."
        multiline
        minRows={4}
        disabled
      />

      <Suggestions>
        {suggestions.map((suggestion) => (
          <Suggestion key={suggestion} disabled>
            {suggestion}
          </Suggestion>
        ))}
      </Suggestions>
    </AdjustmentRoot>
  )
}
