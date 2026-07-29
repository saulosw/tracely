import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'

import type { AsElement } from '@/shared/types/styled'


export const AdjustmentRoot = styled(Box)<AsElement>({
  marginTop: 38,
})

export const Suggestions = styled(Stack)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
  marginTop: 16,
})

export const Suggestion = styled(Button)(({ theme }) => ({
  padding: '8px 16px',
  fontSize: 13.5,
  borderRadius: theme.tracely.radius.pill,
  borderColor: theme.tracely.border('soft'),
  color: theme.tracely.colors.inkMuted,
}))
