import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'


export const PeriodGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 12,

  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}))

export const RangeSlot = styled(Box)({
  marginTop: 16,
  maxWidth: 320,
})
