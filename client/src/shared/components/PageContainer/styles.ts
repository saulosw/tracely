import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'


export type PageAlign = 'center' | 'top'

export const Viewport = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  padding: '60px 48px',

  [theme.breakpoints.down('sm')]: {
    padding: '40px 24px',
  },
}))

export const Content = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'maxWidth' && prop !== 'align',
})<{ maxWidth: number; align: PageAlign }>(({ maxWidth, align }) => ({
  width: '100%',
  maxWidth,
  margin: align === 'center' ? 'auto' : '0 auto auto',
}))
