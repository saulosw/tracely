import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import type { AsElement, AsLink } from '@/shared/types/styled'


export const EntryRoot = styled(Box)<AsElement>(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: 10,
  padding: '7px 0',
  color: theme.tracely.colors.inkProse,

  '&::before': {
    content: '""',
    flexShrink: 0,
    width: 4,
    height: 4,
    marginTop: 8,
    borderRadius: '50%',
    background: theme.tracely.colors.accentDim,
  },
}))

export const EntryBody = styled(Box)({
  flex: 1,
  minWidth: 0,
})

export const EntryText = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkProse,
  lineHeight: 1.65,
}))

export const EntryLink = styled(Link)(({ theme }) => ({
  color: theme.tracely.colors.inkProse,
  lineHeight: 1.65,
  transition: theme.tracely.transition.fast,

  '&:hover': {
    color: theme.tracely.colors.accentBright,
  },
}))

export const EntryDetail = styled('span')(({ theme }) => ({
  color: theme.tracely.colors.inkFaint,
}))

export const Disclosure = styled(ButtonBase)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'baseline',
  gap: 6,
  padding: 0,
  color: theme.tracely.colors.inkProse,
  fontFamily: theme.tracely.fonts.sans,
  fontSize: 15,
  lineHeight: 1.65,
  textAlign: 'left',
  transition: theme.tracely.transition.fast,

  '&:hover': {
    color: theme.tracely.colors.accentBright,
  },
}))

export const Chevron = styled('span', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  display: 'inline-flex',
  alignSelf: 'center',
  color: theme.tracely.colors.inkFainter,
  transform: open ? 'rotate(180deg)' : 'none',
  transition: theme.tracely.transition.fast,
}))

export const ItemList = styled(Box)<AsElement>(({ theme }) => ({
  display: 'grid',
  gap: 2,
  margin: '6px 0 8px',
  padding: '2px 0 2px 14px',
  borderLeft: `1px solid ${theme.tracely.border('faint')}`,
  listStyle: 'none',
}))

export const ItemRow = styled(Box)<AsElement>({
  display: 'flex',
  alignItems: 'baseline',
  gap: 10,
})

export const ItemTime = styled(Typography)(({ theme }) => ({
  flexShrink: 0,
  minWidth: 42,
  color: theme.tracely.colors.inkFaintest,
  fontFamily: theme.tracely.fonts.mono,
}))

export const ItemLink = styled(Link)<AsLink>(({ theme }) => ({
  color: theme.tracely.colors.inkSoft,
  transition: theme.tracely.transition.fast,

  '&:hover': {
    color: theme.tracely.colors.accentBright,
  },
}))

export const ItemText = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkSoft,
}))

export const ItemNote = styled(Typography)<AsElement>(({ theme }) => ({
  marginTop: 4,
  color: theme.tracely.colors.inkFaintest,
}))

export const EntryTag = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 26,
  height: 26,
  borderRadius: '50%',
  border: `1px solid ${theme.tracely.border('hairline')}`,
  color: theme.tracely.colors.inkFainter,
}))

export const EntryTime = styled(Typography)(({ theme }) => ({
  flexShrink: 0,
  minWidth: 46,
  color: theme.tracely.colors.inkFainter,
  fontFamily: theme.tracely.fonts.mono,
}))
