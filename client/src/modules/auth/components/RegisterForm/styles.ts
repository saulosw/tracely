import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'

import type { AsForm } from '@/shared/types/styled'


export const Form = styled(Stack)<AsForm>({
  gap: 14,
})

export const PasswordRow = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  gap: 12,

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: 14,
  },
}))

export const SubmitButton = styled(Button)({
  marginTop: 6,
})
