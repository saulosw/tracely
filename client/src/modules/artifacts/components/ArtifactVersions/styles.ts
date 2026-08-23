import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import type { AsElement, AsLink } from '@/shared/types/styled'


export const VersionsRoot = styled(Box)<AsElement>({
  marginTop: 40,
})

export const VersionsTitle = styled(Typography)(({ theme }) => ({
  display: 'block',
  marginBottom: 8,
  color: theme.tracely.colors.inkFaintest,
}))

export const VersionList = styled(Box)<AsElement>({
  display: 'grid',
  padding: 0,
  margin: 0,
  listStyle: 'none',
})

export const VersionRow = styled(Box)<AsLink>(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 16,
  padding: '13px 0',
  borderTop: `1px solid ${theme.tracely.border('hairline')}`,
  color: theme.tracely.colors.inkQuiet,
  textDecoration: 'none',
  transition: theme.tracely.transition.fast,

  '&:hover': {
    color: theme.tracely.colors.accentBright,
  },
}))

export const VersionCurrent = styled(Box)<AsElement>(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 16,
  padding: '13px 0',
  borderTop: `1px solid ${theme.tracely.border('hairline')}`,
  color: theme.tracely.colors.inkStrong,
}))

export const VersionStamp = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFainter,
  fontFamily: theme.tracely.fonts.mono,
}))
