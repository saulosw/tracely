import Box from '@mui/material/Box'
import { keyframes, styled } from '@mui/material/styles'


const pulse = keyframes({
  '0%, 100%': { opacity: 0.35, transform: 'scale(0.85)' },
  '50%': { opacity: 1, transform: 'scale(1)' },
})

export const LoaderRoot = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const Pulse = styled(Box)(({ theme }) => ({
  width: 13,
  height: 13,
  borderRadius: '50%',
  background: theme.tracely.colors.accent,
  boxShadow: theme.tracely.glow.accentStrong,
  animation: `${pulse} 1.4s ease-in-out infinite`,
}))
