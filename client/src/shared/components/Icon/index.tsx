import { iconPaths } from './paths'
import { Svg } from './styles'

import type { IconName } from './paths'


type IconProps = {
  name: IconName
  label?: string
}

export function Icon({ name, label }: IconProps) {
  return (
    <Svg
      viewBox="0 0 24 24"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={iconPaths[name]} />
    </Svg>
  )
}

export type { IconName }
