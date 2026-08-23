import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import FormLabel from '@mui/material/FormLabel'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'


export const FieldLabel = styled(FormLabel)({
  display: 'block',
  marginBottom: 7,
})

export const Trigger = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'filled',
})<{ filled: boolean }>(({ theme, filled }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  width: '100%',
  padding: '13px 15px',
  borderRadius: theme.tracely.radius.input,
  border: `1px solid ${theme.tracely.border('default')}`,
  background: theme.tracely.colors.surface,
  color: filled ? theme.tracely.colors.ink : theme.tracely.colors.inkFaint,
  fontFamily: theme.tracely.fonts.sans,
  fontSize: 15,
  textAlign: 'left',
  transition: theme.tracely.transition.fast,

  '&:hover': {
    borderColor: theme.tracely.border('stronger'),
  },

  '&[aria-expanded="true"]': {
    borderColor: theme.tracely.accentTint(0.6),
  },

  '& svg': {
    color: theme.tracely.colors.inkFaint,
  },
}))

export const Overlay = styled(Popover)(({ theme }) => ({
  '& .MuiPaper-root': {
    marginTop: 6,
    borderRadius: theme.tracely.radius.panel,
    border: `1px solid ${theme.tracely.border('default')}`,
    background: theme.tracely.colors.surface,
    backgroundImage: 'none',
  },
}))

export const Calendar = styled(Box)({
  width: 296,
  padding: 14,
})

export const Header = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  marginBottom: 10,
})

export const NavButton = styled(IconButton)(({ theme }) => ({
  padding: 6,
  borderRadius: theme.tracely.radius.sm,
  color: theme.tracely.colors.inkFaint,
  transition: theme.tracely.transition.fast,

  '&:hover': {
    background: theme.tracely.surfaceTint(0.05),
    color: theme.tracely.colors.inkStrong,
  },
}))

export const TitleButton = styled(ButtonBase)(({ theme }) => ({
  padding: '6px 10px',
  borderRadius: theme.tracely.radius.sm,
  color: theme.tracely.colors.inkStrong,
  fontFamily: theme.tracely.fonts.sans,
  fontSize: 14.5,
  transition: theme.tracely.transition.fast,

  '&:hover': {
    background: theme.tracely.surfaceTint(0.05),
  },
}))

export const WeekdayRow = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  marginBottom: 4,
})

export const Weekday = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFaintest,
  textAlign: 'center',
}))

export const DayGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 2,
})

export const DayCell = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'inRange',
})<{ selected: boolean; inRange: boolean }>(({ theme, selected, inRange }) => ({
  height: 34,
  borderRadius: theme.tracely.radius.sm,
  border: `1px solid ${selected ? theme.tracely.accentTint(0.5) : 'transparent'}`,
  background: selected
    ? theme.tracely.accentTint(0.14)
    : inRange
      ? theme.tracely.accentTint(0.06)
      : 'transparent',
  color: selected ? theme.tracely.colors.accentBright : theme.tracely.colors.ink,
  fontFamily: theme.tracely.fonts.mono,
  fontSize: 13,
  transition: theme.tracely.transition.fast,

  '&:hover': {
    background: selected ? theme.tracely.accentTint(0.18) : theme.tracely.surfaceTint(0.05),
  },

  '&.Mui-disabled': {
    color: theme.tracely.colors.inkFaintest,
  },
}))

export const MonthGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 6,
})

export const MonthCell = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected: boolean }>(({ theme, selected }) => ({
  height: 46,
  borderRadius: theme.tracely.radius.sm,
  border: `1px solid ${selected ? theme.tracely.accentTint(0.5) : 'transparent'}`,
  background: selected ? theme.tracely.accentTint(0.1) : 'transparent',
  color: selected ? theme.tracely.colors.accentBright : theme.tracely.colors.ink,
  fontFamily: theme.tracely.fonts.sans,
  fontSize: 13.5,
  transition: theme.tracely.transition.fast,

  '&:hover': {
    background: selected ? theme.tracely.accentTint(0.14) : theme.tracely.surfaceTint(0.05),
  },
}))

export const Footer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 6,
  marginTop: 12,
  paddingTop: 10,
  borderTop: `1px solid ${theme.tracely.border('faint')}`,
}))

export const FooterAction = styled(Button)(({ theme }) => ({
  padding: '7px 12px',
  border: 'none',
  color: theme.tracely.colors.inkMuted,
  fontSize: 13,

  '&:hover': {
    border: 'none',
    background: theme.tracely.surfaceTint(0.05),
    color: theme.tracely.colors.inkStrong,
  },
}))
