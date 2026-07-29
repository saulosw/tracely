import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'


export const SourceRow = styled(Stack)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
})

export const SourceChip = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected: boolean }>(({ theme, selected }) => ({
  padding: '9px 20px',
  fontSize: 14,
  borderRadius: theme.tracely.radius.pill,
  color: selected ? theme.tracely.colors.accentBright : theme.tracely.colors.inkMuted,
  borderColor: selected ? theme.tracely.accentTint(0.5) : theme.tracely.border('soft'),
  background: selected ? theme.tracely.accentTint(0.07) : 'transparent',

  '&:hover': {
    borderColor: selected ? theme.tracely.accentTint(0.6) : theme.tracely.border('stronger'),
    background: selected ? theme.tracely.accentTint(0.09) : 'transparent',
  },
}))

export const SourceNote = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFaint,
  margin: '14px 0 0',
}))

export const SourceError = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.danger,
  margin: '14px 0 0',
}))
