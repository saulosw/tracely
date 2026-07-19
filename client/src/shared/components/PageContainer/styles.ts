import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'


export const Container = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'maxWidth',
})<{ maxWidth: number }>(({ theme, maxWidth }) => ({
  maxWidth,
  margin: '0 auto',
  padding: '60px 48px 100px',

  [theme.breakpoints.down('sm')]: {
    padding: '40px 24px 80px',
  },
}))
