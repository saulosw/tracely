import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import type { AsElement } from '@/shared/types/styled'


export const UpcomingRoot = styled(Box)<AsElement>({
  marginTop: 44,
})

export const UpcomingTitle = styled(Typography)(({ theme }) => ({
  display: 'block',
  color: theme.tracely.colors.inkDim,
  marginBottom: 16,
}))

export const UpcomingGrid = styled(Stack)<AsElement>({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
  listStyle: 'none',
  margin: 0,
  padding: 0,
})

export const UpcomingItem = styled(Stack)<AsElement>(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  padding: '10px 16px',
  borderRadius: theme.tracely.radius.pill,
  border: `1px dashed ${theme.tracely.border('hairline')}`,
  color: theme.tracely.colors.inkFaintest,
}))

export const UpcomingLabel = styled(Typography)({
  lineHeight: 1,
})
