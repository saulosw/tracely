import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'


export const ComingRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 14,
  marginTop: 34,
  padding: '28px 30px',
  borderRadius: theme.tracely.radius.cardLarge,
  border: `1px solid ${theme.tracely.border('hairline')}`,
  background: theme.tracely.surfaceTint(0.01),
}))

export const ComingText = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFaint,
  maxWidth: 520,
  margin: 0,
}))
