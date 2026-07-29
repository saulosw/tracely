import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import type { AsLink } from '@/shared/types/styled'


export const StoryRoot = styled(Stack)(({ theme }) => ({
  position: 'relative',
  alignItems: 'center',
  textAlign: 'center',
  maxWidth: 620,
  margin: '0 auto',
  paddingTop: 26,

  [theme.breakpoints.down('sm')]: {
    paddingTop: 8,
  },
}))

export const Glow = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -140,
  left: '50%',
  width: 640,
  height: 420,
  transform: 'translateX(-50%)',
  pointerEvents: 'none',
  background: `radial-gradient(circle, ${theme.tracely.accentTint(0.07)} 0%, transparent 68%)`,
}))

export const Eyebrow = styled(Typography)({
  position: 'relative',
  display: 'block',
  marginBottom: 26,
})

export const Rail = styled(Box)({
  position: 'relative',
  width: '100%',
})

export const Title = styled(Typography)({
  position: 'relative',
  margin: '38px 0 0',
})

export const Lead = styled(Typography)(({ theme }) => ({
  position: 'relative',
  color: theme.tracely.colors.inkSoft,
  margin: '22px 0 0',
}))

export const ConnectButton = styled(Button)<AsLink>({
  marginTop: 34,
})

export const Steps = styled(Box)({
  position: 'relative',
  width: '100%',
  marginTop: 44,
})

export const Closing = styled(Typography)(({ theme }) => ({
  position: 'relative',
  color: theme.tracely.colors.inkFaintest,
  margin: '40px 0 0',
}))
