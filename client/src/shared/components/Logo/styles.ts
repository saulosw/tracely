import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'


export type LogoSize = 'hero' | 'compact'

const sizes: Record<LogoSize, { mark: number; gap: number; word: number }> = {
  hero: { mark: 13, gap: 13, word: 27 },
  compact: { mark: 11, gap: 11, word: 23 },
}

export const LogoRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size: LogoSize }>(({ size }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: sizes[size].gap,
}))

export const Mark = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size: LogoSize }>(({ theme, size }) => ({
  width: sizes[size].mark,
  height: sizes[size].mark,
  borderRadius: '50%',
  flexShrink: 0,
  background: theme.tracely.colors.accent,
  boxShadow: theme.tracely.glow.accentStrong,
}))

export const Wordmark = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size: LogoSize }>(({ size }) => ({
  fontSize: sizes[size].word,
}))
