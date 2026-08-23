import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'

import { Providers } from '@/app/providers'

import type { ReactElement } from 'react'


export function renderWithProviders(ui: ReactElement, route = '/login', pattern?: string) {
  const [path] = route.split('?')

  return render(
    <Providers>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={pattern ?? path} element={ui} />
          <Route path="/dashboard" element={<p>painel</p>} />
        </Routes>
      </MemoryRouter>
    </Providers>,
  )
}
