import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'


export const Footer = styled(Box)({
  display: 'grid',
  gap: 16,
  marginTop: 46,
  textAlign: 'center',
})

export const SubmitButton = styled(Button)(({ theme }) => ({
  padding: '17px 24px',
  fontSize: 16,

  '&.Mui-disabled': {
    opacity: 1,
    background: theme.tracely.surfaceTint(0.04),
    color: theme.tracely.colors.inkFaint,
    border: `1px solid ${theme.tracely.border('faint')}`,
  },
}))
