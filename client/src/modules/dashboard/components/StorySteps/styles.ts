import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import type { AsElement } from '@/shared/types/styled'


export const StepsRoot = styled(Stack)<AsElement>(({ theme }) => ({
  flexDirection: 'row',
  gap: 12,
  listStyle: 'none',
  margin: 0,
  padding: 0,

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}))

export const StepItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'current',
})<AsElement & { current: boolean }>(({ theme, current }) => ({
  flex: 1,
  textAlign: 'left',
  padding: '16px 18px',
  borderRadius: theme.tracely.radius.card,
  border: `1px solid ${current ? theme.tracely.accentTint(0.28) : theme.tracely.border('hairline')}`,
  background: current ? theme.tracely.accentTint(0.05) : theme.tracely.surfaceTint(0.015),
  transition: theme.tracely.transition.fast,
}))

export const StepNumber = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'current',
})<{ current: boolean }>(({ theme, current }) => ({
  display: 'block',
  color: current ? theme.tracely.colors.accent : theme.tracely.colors.inkFaintest,
}))

export const StepTitle = styled(Typography)(({ theme }) => ({
  display: 'block',
  color: theme.tracely.colors.inkQuiet,
  margin: '10px 0 0',
}))

export const StepDetail = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFainter,
  margin: '4px 0 0',
}))
