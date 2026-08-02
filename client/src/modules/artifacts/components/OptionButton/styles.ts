import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'


export const OptionRoot = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected: boolean }>(({ theme, selected }) => ({
  gap: 9,
  padding: '13px 16px',
  fontSize: 14.5,
  color: selected ? theme.tracely.colors.accentBright : theme.tracely.colors.ink,
  borderColor: selected ? theme.tracely.accentTint(0.5) : theme.tracely.border('default'),
  background: selected ? theme.tracely.accentTint(0.07) : 'transparent',

  '&:hover': {
    borderColor: selected ? theme.tracely.accentTint(0.6) : theme.tracely.border('stronger'),
    background: selected ? theme.tracely.accentTint(0.09) : 'transparent',
  },

  '&.Mui-disabled': {
    color: theme.tracely.colors.inkFaintest,
    borderColor: theme.tracely.border('hairline'),
  },
}))
