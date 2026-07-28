import { createBrowserRouter, Navigate } from 'react-router-dom'

import { LoginPage, RegisterPage } from '@/modules/auth'
import { DashboardPage } from '@/modules/dashboard'
import { PageContainer } from '@/shared/components/PageContainer'
import { AppShell } from '../layouts/AppShell'
import { GuestRoute } from './GuestRoute'
import { ProtectedRoute } from './ProtectedRoute'


export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/connect', element: <PageContainer /> },
          { path: '/generate', element: <PageContainer /> },
          { path: '/history', element: <PageContainer /> },
        ],
      },
    ],
  },
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '*', element: <Navigate to="/login" replace /> },
])
