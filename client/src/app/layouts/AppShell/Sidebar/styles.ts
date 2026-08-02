import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'

import type { AsElement, AsLink } from '@/shared/types/styled'


export const SidebarRoot = styled(Stack)<AsElement>(({ theme }) => ({
  width: 272,
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

export const NewArtifactButton = styled(Button)<AsLink>({
  marginTop: 22,
})

export const Footer = styled(Box)({
  marginTop: 'auto',
})
