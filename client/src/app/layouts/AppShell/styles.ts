import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

import type { AsElement } from '@/shared/types/styled'


export const ShellRoot = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
})

export const Content = styled(Box)<AsElement>({
  flex: 1,
  height: '100vh',
  overflowY: 'auto',
})
