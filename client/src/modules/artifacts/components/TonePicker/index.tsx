import { OptionButton } from '../OptionButton'
import { toneOptions } from './tones'
import { ToneRow } from './styles'


export function TonePicker() {
  return (
    <ToneRow>
      {toneOptions.map((option) => (
        <OptionButton key={option.value} label={option.label} selected={false} disabled pro />
      ))}
    </ToneRow>
  )
}
