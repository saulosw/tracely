import Box from '@mui/material/Box'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'

import type { AsLink } from '@/shared/types/styled'


export const NavItemRoot = styled(ListItemButton)<AsLink>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  borderRadius: theme.tracely.radius.button,
  padding: '11px 12px',
  color: theme.tracely.colors.inkDim,
  transition: theme.tracely.transition.fast,

  '&:hover': {
    background: 'transparent',
    color: theme.tracely.colors.ink,
  },

  '&.active': {
    background: theme.tracely.surfaceTint(0.05),
    color: theme.tracely.colors.inkStrong,
  },
}))

export const NavGlyph = styled(Box)(({ theme }) => ({
  display: 'flex',
  color: theme.tracely.colors.inkFaintest,
  transition: theme.tracely.transition.fast,

  '.active > &': {
    color: theme.tracely.colors.accent,
  },

  '.MuiListItemButton-root:hover > &': {
    color: theme.tracely.colors.inkDim,
  },
}))

export const NavLabel = styled(ListItemText)(({ theme }) => ({
  margin: 0,

  '& .MuiListItemText-primary': {
    fontFamily: theme.tracely.fonts.sans,
    fontSize: 14.5,
    color: 'inherit',
  },
}))
