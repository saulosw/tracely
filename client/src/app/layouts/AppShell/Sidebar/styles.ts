import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'

import type { AsElement } from '@/shared/types/styled'


export const SidebarRoot = styled(Stack)<AsElement>(({ theme }) => ({
  width: 252,
  flexShrink: 0,
  height: '100vh',
  position: 'sticky',
  top: 0,
  padding: '26px 20px',
  borderRight: `1px solid ${theme.tracely.border('faint')}`,
}))

export const Brand = styled(Box)({
  padding: '0 8px 30px',
})

export const Nav = styled(List)<AsElement>({
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  padding: 0,
})

export const NewChapterButton = styled(Button)({
  marginTop: 22,
})

export const Footer = styled(Box)({
  marginTop: 'auto',
})

export const Account = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 11,
  padding: '10px 8px',
  borderTop: `1px solid ${theme.tracely.border('hairline')}`,
}))

export const Avatar = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  flexShrink: 0,
  background: theme.tracely.colors.surfaceRaised,
}))
