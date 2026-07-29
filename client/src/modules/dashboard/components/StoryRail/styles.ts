import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { keyframes, styled } from '@mui/material/styles'


const drift = keyframes({
  '0%': { backgroundPosition: '-20% 0' },
  '100%': { backgroundPosition: '140% 0' },
})

const breathe = keyframes({
  '0%, 100%': { transform: 'scale(1)', opacity: 1 },
  '50%': { transform: 'scale(1.2)', opacity: 0.7 },
})

export const RailRoot = styled(Box)({
  width: '100%',
})

export const RailTrack = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  height: 12,
})

export const RailDot = styled(Box)(({ theme }) => ({
  width: 10,
  height: 10,
  flexShrink: 0,
  borderRadius: '50%',
  background: theme.tracely.colors.accent,
  boxShadow: theme.tracely.glow.accentStrong,
  animation: `${breathe} 3.4s ease-in-out infinite`,

  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
  },
}))

export const RailLine = styled(Box)(({ theme }) => ({
  flex: 1,
  height: 2,
  borderRadius: 1,
  backgroundImage: `repeating-linear-gradient(90deg, ${theme.tracely.border('soft')} 0 9px, transparent 9px 18px)`,
}))

export const RailPulse = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: 20,
  right: 0,
  top: '50%',
  height: 2,
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  backgroundImage: `linear-gradient(90deg, transparent 0%, ${theme.tracely.accentTint(0.45)} 50%, transparent 100%)`,
  backgroundSize: '26% 100%',
  backgroundRepeat: 'no-repeat',
  animation: `${drift} 7s ease-in-out infinite`,

  '@media (prefers-reduced-motion: reduce)': {
    display: 'none',
  },
}))

export const RailEnds = styled(Stack)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 12,
})

export const RailEnd = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFainter,
}))
