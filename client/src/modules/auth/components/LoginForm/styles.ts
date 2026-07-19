import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'

import type { AsForm } from '@/shared/types/styled'


export const Form = styled(Stack)<AsForm>({
  gap: 14,
})

export const ForgotLink = styled(Link)(({ theme }) => ({
  ...theme.typography.label,
}))

export const SubmitButton = styled(Button)({
  marginTop: 6,
})
