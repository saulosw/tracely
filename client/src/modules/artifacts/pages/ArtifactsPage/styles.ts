import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'


export const ArtifactGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 16,
  marginTop: 34,

  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}))
