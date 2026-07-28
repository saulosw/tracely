import Typography from '@mui/material/Typography'
import { alpha, styled } from '@mui/material/styles'


export const AlertRoot = styled(Typography)(({ theme }) => ({
  border: `1px solid ${alpha(theme.tracely.colors.danger, 0.45)}`,
  borderRadius: theme.tracely.radius.input,
  background: alpha(theme.tracely.colors.danger, 0.08),
  color: theme.tracely.colors.danger,
  padding: '11px 14px',
  margin: 0,
}))
