import { OptionButton } from '../OptionButton'
import { ToneGrid } from './styles'
import { tones } from './tones'


export function TonePicker() {
  return (
    <ToneGrid>
      {tones.map((tone, index) => (
        <OptionButton key={tone} label={tone} selected={index === 0} disabled />
      ))}
    </ToneGrid>
  )
}
