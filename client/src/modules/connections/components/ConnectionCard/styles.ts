import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import type { AsElement } from '@/shared/types/styled'


export const CardRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'available' && prop !== 'connected',
})<AsElement & { available: boolean; connected: boolean }>(
  ({ theme, available, connected }) => ({
    borderRadius: theme.tracely.radius.cardLarge,
    border: `1px solid ${
      connected
        ? theme.tracely.accentTint(0.28)
        : theme.tracely.border(available ? 'faint' : 'hairline')
    }`,
    background: connected
      ? theme.tracely.accentTint(0.03)
      : theme.tracely.surfaceTint(available ? 0.02 : 0.01),
    transition: theme.tracely.transition.fast,
  }),
)

export const CardHead = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 16,
  padding: '20px 22px',

  [theme.breakpoints.down('sm')]: {
    flexWrap: 'wrap',
  },
}))

export const GlyphBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'available' && prop !== 'connected',
})<{ available: boolean; connected: boolean }>(({ theme, available, connected }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 42,
  height: 42,
  flexShrink: 0,
  borderRadius: theme.tracely.radius.panel,
  border: `1px solid ${
    connected ? theme.tracely.accentTint(0.35) : theme.tracely.border('hairline')
  }`,
  background: connected ? theme.tracely.accentTint(0.07) : theme.tracely.colors.canvas,
  boxShadow: connected ? theme.tracely.glow.accentSoft : 'none',
  color: connected
    ? theme.tracely.colors.accent
    : available
      ? theme.tracely.colors.inkQuiet
      : theme.tracely.colors.inkFaintest,
  transition: theme.tracely.transition.fast,

  '& svg': {
    width: 20,
    height: 20,
  },
}))

export const Headline = styled(Box)({
  flex: 1,
  minWidth: 180,
})

export const Name = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'available',
})<{ available: boolean }>(({ theme, available }) => ({
  display: 'block',
  color: available ? theme.tracely.colors.inkStrong : theme.tracely.colors.inkDim,
}))

export const Description = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkMuted,
  margin: '4px 0 0',
}))

export const Account = styled(Typography)(({ theme }) => ({
  display: 'block',
  color: theme.tracely.colors.accentPale,
  marginTop: 6,
}))

export const Actions = styled(Stack)({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 14,
})

export const ActionButton = styled(Button)({
  padding: '9px 18px',
  fontSize: 14,
})

export const Detail = styled(Box)(({ theme }) => ({
  padding: '20px 22px 22px',
  borderTop: `1px solid ${theme.tracely.border('hairline')}`,
}))

export const DetailText = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkSoft,
  maxWidth: 560,
  margin: 0,
}))

export const ConnectButton = styled(Button)({
  marginTop: 18,
  padding: '11px 20px',
  fontSize: 14,
})

export const ConnectNote = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFaintest,
  margin: '10px 0 0',
}))

export const StaleNote = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.danger,
  margin: '10px 0 0',
}))

export const ErrorSlot = styled(Box)({
  marginTop: 16,
})
