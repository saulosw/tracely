import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'

import type { AsElement, AsLink } from '@/shared/types/styled'


export const GroupChevron = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  display: 'flex',
  marginLeft: 'auto',
  color: theme.tracely.colors.inkFaintest,
  transform: open ? 'rotate(180deg)' : 'none',
  transition: theme.tracely.transition.fast,

  '& svg': {
    width: 16,
    height: 16,
  },
}))

export const GroupList = styled(List)<AsElement>({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: '3px 0 2px',
})

export const GroupLink = styled(ButtonBase)<AsLink & { end?: boolean }>(({ theme }) => ({
  justifyContent: 'flex-start',
  width: '100%',
  padding: '9px 13px 9px 44px',
  borderRadius: theme.tracely.radius.button,
  color: theme.tracely.colors.inkDim,
  fontFamily: theme.tracely.fonts.sans,
  fontSize: 14.5,
  textAlign: 'left',
  textDecoration: 'none',
  transition: theme.tracely.transition.fast,

  '&:hover': {
    color: theme.tracely.colors.ink,
  },

  '&.active': {
    background: theme.tracely.surfaceTint(0.05),
    color: theme.tracely.colors.inkStrong,
  },
}))
