import Box from '@mui/material/Box'
import FormLabel from '@mui/material/FormLabel'
import { styled } from '@mui/material/styles'


export const LabelRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  marginBottom: 7,

  '& > *': {
    minWidth: 0,
  },
}))

export const FieldLabel = styled(FormLabel)({
  display: 'block',
})
