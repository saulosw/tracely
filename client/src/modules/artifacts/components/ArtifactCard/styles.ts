import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import type { AsLink } from '@/shared/types/styled'


export const CardRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'available',
})<AsLink & { available: boolean }>(({ theme, available }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  padding: '22px 24px 26px',
  borderRadius: theme.tracely.radius.cardLarge,
  border: `1px solid ${theme.tracely.border(available ? 'faint' : 'hairline')}`,
  background: theme.tracely.surfaceTint(available ? 0.02 : 0.01),
  textDecoration: 'none',
  transition: theme.tracely.transition.fast,

  ...(available && {
    '&:hover': {
      borderColor: theme.tracely.accentTint(0.35),
      background: theme.tracely.accentTint(0.04),
    },
  }),
}))

export const GlyphBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'available',
})<{ available: boolean }>(({ theme, available }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'flex-start',
  width: 42,
  height: 42,
  borderRadius: theme.tracely.radius.panel,
  border: `1px solid ${
    available ? theme.tracely.accentTint(0.28) : theme.tracely.border('hairline')
  }`,
  background: available ? theme.tracely.accentTint(0.07) : theme.tracely.colors.canvas,
  color: available ? theme.tracely.colors.accent : theme.tracely.colors.inkFaintest,

  '& svg': {
    width: 21,
    height: 21,
  },
}))

export const Name = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'available',
})<{ available: boolean }>(({ theme, available }) => ({
  color: available ? theme.tracely.colors.inkStrong : theme.tracely.colors.inkFaint,
}))

export const Description = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFaint,
  margin: 0,
}))
