import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import type { AsElement } from '@/shared/types/styled'


export const TimelineRoot = styled(Box)<AsElement>({
  display: 'grid',
  gap: 4,
  padding: 0,
  margin: 0,
  listStyle: 'none',
})

export const SectionRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'railed',
})<AsElement & { railed: boolean }>(({ theme, railed }) => ({
  display: 'grid',
  gridTemplateColumns: railed ? '132px 1fr' : '1fr',
  gap: 20,
  padding: '18px 0',
  borderTop: `1px solid ${theme.tracely.border('hairline')}`,

  '&:first-of-type': {
    borderTop: 'none',
  },

  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gap: 8,
  },
}))

export const Rail = styled(Box)({
  display: 'grid',
  gap: 2,
  alignContent: 'start',
})

export const RailDate = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkSoft,
  fontFamily: theme.tracely.fonts.mono,
}))

export const RailSpan = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFaintest,
}))

export const EntryList = styled(Box)<AsElement>({
  display: 'grid',
  gap: 2,
  padding: 0,
  margin: 0,
  listStyle: 'none',
})

export const Overflow = styled(Typography)(({ theme }) => ({
  padding: '7px 0 0 14px',
  color: theme.tracely.colors.inkFaintest,
}))
