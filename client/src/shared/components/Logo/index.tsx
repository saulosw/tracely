import type { LogoSize } from './styles'
import { LogoRoot, Mark, Wordmark } from './styles'


type LogoProps = {
  size?: LogoSize
}

export function Logo({ size = 'compact' }: LogoProps) {
  return (
    <LogoRoot size={size}>
      <Mark size={size} aria-hidden />
      <Wordmark size={size} variant="wordmark">
        Tracely
      </Wordmark>
    </LogoRoot>
  )
}
