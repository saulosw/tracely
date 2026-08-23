import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import type { AsElement, AsLink } from '@/shared/types/styled'


export const BackLink = styled(Typography)<AsLink>(({ theme }) => ({
  display: 'inline-block',
  marginBottom: 26,
  color: theme.tracely.colors.inkFaint,
  textDecoration: 'none',
  transition: theme.tracely.transition.fast,

  '&:hover': {
    color: theme.tracely.colors.accentBright,
  },
}))

export const Head = styled(Box)<AsElement>({
  display: 'grid',
  gap: 0,
})

export const Eyebrow = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFainter,
}))

export const Title = styled(Typography)(({ theme }) => ({
  marginTop: 6,
  color: theme.tracely.colors.inkStrong,
}))

export const Lede = styled(Typography)(({ theme }) => ({
  marginTop: 10,
  maxWidth: 620,
  color: theme.tracely.colors.inkSoft,
  fontStyle: 'italic',
}))

export const MetaRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 10,
  marginTop: 22,
})

export const MetaText = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFainter,
  fontFamily: theme.tracely.fonts.mono,
}))

export const SourceTag = styled(Typography)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '3px 10px',
  borderRadius: theme.tracely.radius.pill,
  border: `1px solid ${theme.tracely.border('faint')}`,
  color: theme.tracely.colors.inkQuiet,
}))

export const Timeline = styled(Box)(({ theme }) => ({
  marginTop: 30,
  paddingTop: 4,
  borderTop: `1px solid ${theme.tracely.border('subtle')}`,
}))

export const Footnote = styled(Typography)(({ theme }) => ({
  paddingTop: 18,
  borderTop: `1px solid ${theme.tracely.border('hairline')}`,
  color: theme.tracely.colors.inkFainter,
  fontFamily: theme.tracely.fonts.mono,
}))

export const Actions = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
  marginTop: 30,
})

export const RegenerateButton = styled(Button)(({ theme }) => ({
  padding: '10px 16px',
  fontSize: 13.5,

  '&.Mui-disabled': {
    opacity: 1,
    color: theme.tracely.colors.inkFaint,
  },
}))

export const EmptyNote = styled(Typography)(({ theme }) => ({
  padding: '34px 0',
  color: theme.tracely.colors.inkFaint,
}))
