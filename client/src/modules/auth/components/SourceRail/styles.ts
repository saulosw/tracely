import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { keyframes, styled } from '@mui/material/styles'

import type { AsElement } from '@/shared/types/styled'


const drift = keyframes({
  '0%': { backgroundPosition: '-30% 0' },
  '100%': { backgroundPosition: '130% 0' },
})

const nodeSize = 'clamp(30px, 2vw, 38px)'

export const RailRoot = styled(Box)({
  width: '100%',
})

export const RailLabel = styled(Typography)({
  display: 'block',
})

export const RailTrack = styled(Box)({
  position: 'relative',
  marginTop: 20,
})

export const RailLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  insetInline: 0,
  top: '50%',
  height: 1,
  background: `linear-gradient(90deg, ${theme.tracely.border('soft')} 0%, ${theme.tracely.border('soft')} 55%, transparent 96%)`,
}))

export const RailPulse = styled(Box)(({ theme }) => ({
  position: 'absolute',
  insetInline: 0,
  top: '50%',
  height: 1,
  backgroundImage: `linear-gradient(90deg, transparent 0%, ${theme.tracely.accentTint(0.5)} 50%, transparent 100%)`,
  backgroundSize: '30% 100%',
  backgroundRepeat: 'no-repeat',
  animation: `${drift} 9s ease-in-out infinite`,

  '@media (prefers-reduced-motion: reduce)': {
    display: 'none',
  },
}))

export const RailMarks = styled(Stack)<AsElement>({
  position: 'relative',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 'clamp(10px, 1.4vw, 28px)',
  listStyle: 'none',
  margin: 0,
  padding: 0,
})

export const SourceNode = styled(Box)<AsElement>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: nodeSize,
  height: nodeSize,
  borderRadius: '50%',
  border: `1px solid ${theme.tracely.border('faint')}`,
  background: theme.tracely.colors.canvas,
  color: theme.tracely.colors.inkFaint,
  transition: theme.tracely.transition.fast,

  '&:hover': {
    color: theme.tracely.colors.accentPale,
    borderColor: theme.tracely.accentTint(0.35),
    boxShadow: theme.tracely.glow.accentSoft,
  },
}))
