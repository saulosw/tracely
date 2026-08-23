import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'


export const ArtifactGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 16,
  marginTop: 34,
})
