import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { Link } from 'react-router-dom'


export const SwitchText = styled(Typography)(({ theme }) => ({
  fontSize: 14.5,
  color: theme.tracely.colors.inkDim,
}))

export const SwitchLink = styled(Link)(({ theme }) => ({
  color: theme.tracely.colors.accent,
  textDecoration: 'underline',
  textUnderlineOffset: 3,
  transition: theme.tracely.transition.fast,

  '&:hover': {
    color: theme.tracely.colors.accentBright,
  },
}))
