import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import type { CSSObject, Theme } from '@mui/material/styles'


export type StatusTone = 'neutral' | 'accent' | 'muted' | 'pro'

const tones = (theme: Theme): Record<StatusTone, CSSObject> => ({
  neutral: {
    color: theme.tracely.colors.inkDim,
    borderColor: theme.tracely.border('faint'),
  },
  accent: {
    color: theme.tracely.colors.accent,
    borderColor: theme.tracely.accentTint(0.35),
    background: theme.tracely.accentTint(0.07),
  },
  muted: {
    color: theme.tracely.colors.inkFaintest,
    borderColor: theme.tracely.border('hairline'),
  },
  pro: {
    color: theme.tracely.colors.accentDim,
    borderColor: theme.tracely.accentTint(0.28),
    fontSize: 10,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '2px 7px',
  },
})

export const PillRoot = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: StatusTone }>(({ theme, tone }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  whiteSpace: 'nowrap',
  padding: '4px 11px',
  borderRadius: theme.tracely.radius.pill,
  border: '1px solid transparent',
  background: 'transparent',
  ...tones(theme)[tone],
}))
