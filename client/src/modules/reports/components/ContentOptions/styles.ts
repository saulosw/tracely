import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'


export const OptionsRoot = styled(Stack)(({ theme }) => ({
  borderRadius: theme.tracely.radius.cardLarge,
  border: `1px solid ${theme.tracely.border('faint')}`,
  background: theme.tracely.surfaceTint(0.02),
}))

export const OptionRow = styled(Box)(({ theme }) => ({
  padding: '18px 22px',

  '& + &': {
    borderTop: `1px solid ${theme.tracely.border('hairline')}`,
  },
}))

export const RowHead = styled(Stack)({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
})

export const RowTitle = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkQuiet,
}))

export const RowDetail = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFaint,
  margin: '5px 0 12px',
}))
