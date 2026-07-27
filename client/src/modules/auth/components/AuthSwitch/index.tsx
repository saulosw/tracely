import { SwitchLink, SwitchText } from './styles'


type AuthSwitchProps = {
  prompt: string
  actionLabel: string
  to: string
}

export function AuthSwitch({ prompt, actionLabel, to }: AuthSwitchProps) {
  return (
    <SwitchText variant="body1">
      {prompt} <SwitchLink to={to}>{actionLabel}</SwitchLink>
    </SwitchText>
  )
}
