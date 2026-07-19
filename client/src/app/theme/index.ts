import { alpha, createTheme } from '@mui/material/styles'

import { components } from './components'
import { palette } from './palette'
import { borderAlpha, colors, fonts, glow, radius, transition } from './tokens'
import { typography } from './typography'


const border = Object.assign(
  (level: keyof typeof borderAlpha = 'default') => alpha('#ffffff', borderAlpha[level]),
  { alpha: borderAlpha },
)

export const theme = createTheme({
  palette,
  typography,
  components,
  shape: {
    borderRadius: radius.input,
  },
  tracely: {
    fonts,
    colors,
    radius,
    glow,
    transition,
    border,
    surfaceTint: (opacity: number) => alpha('#ffffff', opacity),
    accentTint: (opacity: number) => alpha(colors.accent, opacity),
  },
})

export { colors, fonts, radius } from './tokens'
