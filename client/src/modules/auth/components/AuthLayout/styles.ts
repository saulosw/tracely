import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import type { AsElement } from '@/shared/types/styled'


export const Split = styled(Box)(({ theme }) => ({
  height: '100vh',
  overflow: 'hidden',
  display: 'grid',
  gridTemplateColumns: '1.5fr 1fr',

  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '1.15fr 1fr',
  },

  [theme.breakpoints.down('md')]: {
    height: 'auto',
    minHeight: '100vh',
    overflow: 'visible',
    gridTemplateColumns: '1fr',
  },
}))

export const Editorial = styled(Stack)<AsElement>(({ theme }) => ({
  justifyContent: 'space-between',
  gap: theme.spacing(6),
  overflowY: 'auto',
  padding: '56px clamp(56px, 4vw, 88px)',
  borderRight: `1px solid ${theme.tracely.border('hairline')}`,

  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}))

export const Hero = styled(Box)({
  maxWidth: 780,
})

export const HeroAccent = styled('em')(({ theme }) => ({
  fontStyle: 'italic',
  color: theme.tracely.colors.accent,
}))

export const HeroSub = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkSoft,
  maxWidth: 640,
  margin: '30px 0 0',
}))

export const Sources = styled(Box)({
  marginTop: 34,
})

export const SourcesLabel = styled(Typography)(({ theme }) => ({
  display: 'block',
  color: theme.tracely.colors.inkFaint,
  marginBottom: 12,
}))

export const SourceChips = styled(Stack)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
})

export const SourceChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  ...theme.typography.label,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 13px',
  borderRadius: theme.tracely.radius.pill,
  border: active
    ? `1px solid ${theme.tracely.accentTint(0.45)}`
    : `1px dashed ${theme.tracely.border('soft')}`,
  color: active ? theme.tracely.colors.accentPale : theme.tracely.colors.inkFaint,
}))

export const ChipDot = styled(Box)(({ theme }) => ({
  width: 5,
  height: 5,
  borderRadius: '50%',
  background: theme.tracely.colors.accent,
  boxShadow: theme.tracely.glow.accentSoft,
}))

export const Quote = styled(Box)<AsElement>(({ theme }) => ({
  borderLeft: `2px solid ${theme.tracely.accentTint(0.4)}`,
  padding: '4px 0 4px 22px',
  maxWidth: 660,
  margin: 0,
}))

export const QuoteText = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkDim,
  margin: 0,
}))

export const QuoteMeta = styled(Typography)<AsElement>(({ theme }) => ({
  display: 'block',
  fontStyle: 'normal',
  color: theme.tracely.colors.inkFaintest,
  marginTop: 12,
}))

export const Panel = styled(Stack)<AsElement>(({ theme }) => ({
  justifyContent: 'center',
  width: '100%',
  maxWidth: 600,
  margin: '0 auto',
  overflowY: 'auto',
  padding: '56px clamp(32px, 3vw, 64px)',

  [theme.breakpoints.down('md')]: {
    overflowY: 'visible',
  },

  [theme.breakpoints.down('sm')]: {
    padding: '40px 24px',
  },
}))

export const PanelIntro = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkDim,
  margin: '0 0 26px',
}))

export const Terms = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFaintest,
  margin: '28px 0 0',
}))
