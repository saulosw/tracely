import { StatusPill } from '@/shared/components/StatusPill'
import { OptionRoot } from './styles'


type OptionButtonProps = {
  label: string
  selected: boolean
  disabled?: boolean
  pro?: boolean
  onSelect?: () => void
  onBlur?: () => void
}

export function OptionButton({
  label,
  selected,
  disabled = false,
  pro = false,
  onSelect,
  onBlur,
}: OptionButtonProps) {
  return (
    <OptionRoot
      selected={selected}
      disabled={disabled}
      onClick={onSelect}
      onBlur={onBlur}
      aria-pressed={selected}
    >
      {label}
      {pro ? <StatusPill tone="pro">Pro</StatusPill> : null}
    </OptionRoot>
  )
}
