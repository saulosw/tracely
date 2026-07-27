import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/modules/auth'
import { ScreenLoader } from '@/shared/components/ScreenLoader'


export function GuestRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <ScreenLoader />
  }

  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />
  }


  return <Outlet />
}
