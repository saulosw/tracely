import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import type { AsLink } from '@/shared/types/styled'


export const CardRoot = styled(Box)<AsLink>(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 20,
  padding: '20px 24px',
  borderRadius: theme.tracely.radius.card,
  border: `1px solid ${theme.tracely.border('faint')}`,
  background: theme.tracely.surfaceTint(0.02),
  textDecoration: 'none',
  transition: theme.tracely.transition.fast,

  '&:hover': {
    borderColor: theme.tracely.accentTint(0.35),
    background: theme.tracely.accentTint(0.04),
  },
}))

export const Range = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkStrong,
}))

export const Stamp = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFaint,
  margin: '6px 0 0',
}))

export const Count = styled(Typography)(({ theme }) => ({
  flexShrink: 0,
  color: theme.tracely.colors.accent,
  fontFamily: theme.tracely.fonts.mono,
}))
