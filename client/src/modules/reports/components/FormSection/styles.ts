import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import type { AsElement } from '@/shared/types/styled'


export const SectionRoot = styled(Box)<AsElement>({
  marginTop: 38,
})

export const SectionHead = styled(Stack)({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
})

export const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkStrong,
}))

export const SectionOptional = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFaintest,
}))

export const SectionHint = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFaint,
  maxWidth: 560,
  margin: '8px 0 0',
}))

export const SectionBody = styled(Box)({
  marginTop: 16,
})
