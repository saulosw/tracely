import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import type { AsElement } from '@/shared/types/styled'


export const HeaderRoot = styled(Box)<AsElement>({
  marginBottom: 40,
})

export const TitleRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 20,
})

export const Title = styled(Typography)({
  margin: 0,
})

export const Subtitle = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkMuted,
  maxWidth: 620,
  margin: '14px 0 0',
}))
