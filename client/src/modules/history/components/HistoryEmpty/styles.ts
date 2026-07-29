import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import type { AsLink } from '@/shared/types/styled'


export const EmptyRoot = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: '56px 32px',
  borderRadius: theme.tracely.radius.cardLarge,
  border: `1px dashed ${theme.tracely.border('soft')}`,
  background: theme.tracely.surfaceTint(0.015),
}))

export const EmptyMark = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  margin: '0 auto',
  background: theme.tracely.surfaceTint(0.2),
}))

export const EmptyTitle = styled(Typography)(({ theme }) => ({
  display: 'block',
  color: theme.tracely.colors.inkQuiet,
  margin: '20px 0 0',
}))

export const EmptyText = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFaint,
  maxWidth: 420,
  margin: '10px auto 0',
}))

export const EmptyAction = styled(Link)<AsLink>({
  display: 'inline-block',
  marginTop: 22,
})
