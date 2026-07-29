import { OptionRoot } from './styles'


type OptionButtonProps = {
  label: string
  selected: boolean
  disabled?: boolean
  onSelect?: () => void
}

export function OptionButton({ label, selected, disabled = false, onSelect }: OptionButtonProps) {
  return (
    <OptionRoot selected={selected} disabled={disabled} onClick={onSelect} aria-pressed={selected}>
      {label}
    </OptionRoot>
  )
}
