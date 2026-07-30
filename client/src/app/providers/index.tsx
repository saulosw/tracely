import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider } from '@mui/material/styles'
import type { ReactNode } from 'react'

import { AuthProvider } from '@/modules/auth'
import { ConnectionsProvider } from '@/modules/connections'
import { theme } from '../theme'
import { globalStyles } from '../theme/globalStyles'


type ProvidersProps = {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <AuthProvider>
        <ConnectionsProvider>{children}</ConnectionsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
