import { createBrowserRouter, Navigate } from 'react-router'

import {
  ArtifactLibraryPage,
  ArtifactsPage,
  JournalPage,
  JournalResultPage,
} from '@/modules/artifacts'
import { LoginPage, RegisterPage } from '@/modules/auth'
import { ConnectionsPage } from '@/modules/connections'
import { DashboardPage } from '@/modules/dashboard'
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
          { path: '/artifacts/library', element: <ArtifactLibraryPage /> },
          { path: '/artifacts/journal', element: <JournalPage /> },
          { path: '/artifacts/journal/:id', element: <JournalResultPage /> },
          { path: '/schedules', element: <SchedulesPage /> },
          { path: '/generate', element: <Navigate to="/artifacts/journal" replace /> },
        ],
      },
    ],
  },
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '*', element: <Navigate to="/login" replace /> },
])
