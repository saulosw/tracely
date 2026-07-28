import { Navigate, Outlet } from 'react-router'

import { useAuth } from '@/modules/auth'
import { ScreenLoader } from '@/shared/components/ScreenLoader'


export function ProtectedRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <ScreenLoader />
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace />
  }


  return <Outlet />
}
