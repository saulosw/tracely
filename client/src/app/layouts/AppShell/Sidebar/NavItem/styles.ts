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

export const Dot = styled(Box)(({ theme }) => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  flexShrink: 0,
  background: theme.tracely.surfaceTint(0.18),
  transition: theme.tracely.transition.fast,

  '.active > &': {
    background: theme.tracely.colors.accent,
    boxShadow: theme.tracely.glow.accentSoft,
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
