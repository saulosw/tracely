import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { styled } from '@mui/material/styles'

import type { AsLink } from '@/shared/types/styled'


export const TabBar = styled(Tabs)(({ theme }) => ({
  minHeight: 0,
  borderBottom: `1px solid ${theme.tracely.border('subtle')}`,
  marginBottom: 30,

  '& .MuiTabs-indicator': {
    height: 2,
    backgroundColor: theme.tracely.colors.accent,
  },

  '& .MuiTabs-list': {
    gap: 26,
  },
}))

export const TabItem = styled(Tab)<AsLink>(({ theme }) => ({
  minWidth: 0,
  minHeight: 0,
  padding: '4px 0 14px',
  fontFamily: theme.tracely.fonts.sans,
  fontSize: 16,
  fontWeight: 500,
  textTransform: 'none',
  color: theme.tracely.colors.inkFaint,
  transition: 'color .15s',

  '&:hover': {
    color: theme.tracely.colors.ink,
  },

  '&.Mui-selected': {
    color: theme.tracely.colors.inkStrong,
  },
}))
