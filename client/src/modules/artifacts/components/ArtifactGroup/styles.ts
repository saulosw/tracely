import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import type { AsElement } from '@/shared/types/styled'


export const GroupRoot = styled(Box)<AsElement>({
  '& + &': {
    marginTop: 34,
  },
})

export const GroupHead = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 14,
})

export const GroupGlyph = styled(Box)(({ theme }) => ({
  display: 'flex',
  color: theme.tracely.colors.accent,
}))

export const GroupName = styled(Typography)<AsElement>(({ theme }) => ({
  color: theme.tracely.colors.inkQuiet,
}))

export const GroupList = styled(Box)<AsElement>({
  display: 'grid',
  gap: 12,
  padding: 0,
  margin: 0,
  listStyle: 'none',
})
