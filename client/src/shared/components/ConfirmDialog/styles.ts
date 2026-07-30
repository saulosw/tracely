import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'


export const DialogRoot = styled(Dialog)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    background: 'rgba(0, 0, 0, 0.62)',
  },

  '& .MuiPaper-root': {
    width: '100%',
    maxWidth: 440,
    margin: 20,
    padding: '26px 26px 22px',
    borderRadius: theme.tracely.radius.card,
    border: `1px solid ${theme.tracely.border('default')}`,
    background: theme.tracely.colors.surface,
    backgroundImage: 'none',
  },
}))

export const Head = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 16,
})

export const Title = styled(Typography)(({ theme }) => ({
  margin: 0,
  color: theme.tracely.colors.inkStrong,
}))

export const CloseButton = styled(IconButton)(({ theme }) => ({
  flexShrink: 0,
  marginTop: -4,
  marginRight: -6,
  padding: 6,
  borderRadius: theme.tracely.radius.sm,
  color: theme.tracely.colors.inkFaint,
  transition: theme.tracely.transition.fast,

  '&:hover': {
    background: theme.tracely.surfaceTint(0.05),
    color: theme.tracely.colors.inkStrong,
  },
}))

export const Description = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkSoft,
  margin: '12px 0 0',
}))

export const Footer = styled(Stack)({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: 10,
  marginTop: 26,
})

export const FooterButton = styled(Button)({
  padding: '10px 18px',
  fontSize: 14,
})
