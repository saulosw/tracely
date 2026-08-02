import { createBrowserRouter, Navigate } from 'react-router'

import { ArtifactsPage, InsightsPage } from '@/modules/artifacts'
import { LoginPage, RegisterPage } from '@/modules/auth'
import { ConnectionsPage } from '@/modules/connections'
import { DashboardPage } from '@/modules/dashboard'
import { HistoryPage } from '@/modules/history'
import { SchedulesPage } from '@/modules/schedules'
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
          { path: '/connect', element: <ConnectionsPage /> },
          { path: '/artifacts', element: <ArtifactsPage /> },
          { path: '/artifacts/insights', element: <InsightsPage /> },
          { path: '/history', element: <HistoryPage /> },
          { path: '/schedules', element: <SchedulesPage /> },
          { path: '/generate', element: <Navigate to="/artifacts/insights" replace /> },
        ],
      },
    ],
  },
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '*', element: <Navigate to="/login" replace /> },
])
