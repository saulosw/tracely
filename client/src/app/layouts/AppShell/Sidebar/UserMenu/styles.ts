import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'


export const Trigger = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  gap: 11,
  padding: '10px 8px',
  borderRadius: theme.tracely.radius.button,
  borderTop: `1px solid ${theme.tracely.border('hairline')}`,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  textAlign: 'left',
  transition: theme.tracely.transition.fast,

  '&:hover': {
    background: theme.tracely.surfaceTint(0.04),
  },
}))

export const Avatar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: '50%',
  flexShrink: 0,
  background: theme.tracely.colors.surfaceRaised,
  color: theme.tracely.colors.accentPale,
}))

export const Initial = styled(Typography)({
  lineHeight: 1,
})

export const Identity = styled(Box)({
  minWidth: 0,
})

export const AccountName = styled(Typography)(({ theme }) => ({
  display: 'block',
  fontWeight: 500,
  color: theme.tracely.colors.ink,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const AccountEmail = styled(Typography)(({ theme }) => ({
  display: 'block',
  color: theme.tracely.colors.inkFaintest,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const Popover = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    minWidth: 208,
    marginTop: -6,
    borderRadius: theme.tracely.radius.panel,
    border: `1px solid ${theme.tracely.border('default')}`,
    background: theme.tracely.colors.surface,
    backgroundImage: 'none',
  },

  '& .MuiList-root': {
    padding: 6,
  },
}))

export const Action = styled(MenuItem)(({ theme }) => ({
  gap: 11,
  padding: '10px 12px',
  borderRadius: theme.tracely.radius.sm,
  color: theme.tracely.colors.inkQuiet,
  transition: theme.tracely.transition.fast,

  '&:hover': {
    background: theme.tracely.surfaceTint(0.05),
    color: theme.tracely.colors.inkStrong,
  },
}))

export const ActionLabel = styled(Typography)({
  lineHeight: 1,
})
