import type { PaletteOptions } from '@mui/material/styles'

import { colors } from './tokens'


export const palette: PaletteOptions = {
  mode: 'dark',
  background: {
    default: colors.canvas,
    paper: colors.surface,
  },
  primary: {
    main: colors.accent,
    light: colors.accentBright,
    dark: colors.accentPale,
    contrastText: colors.surface,
  },
  success: {
    main: colors.success,
  },
  error: {
    main: colors.danger,
  },
  text: {
    primary: colors.ink,
    secondary: colors.inkMuted,
    disabled: colors.inkFaintest,
  },
  divider: `rgba(255, 255, 255, 0.09)`,
}
