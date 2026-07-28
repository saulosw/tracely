import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { Providers } from '@/app/providers'

import type { ReactElement } from 'react'


export function renderWithProviders(ui: ReactElement, route = '/login') {
  return render(
    <Providers>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={route} element={ui} />
          <Route path="/dashboard" element={<p>painel</p>} />
        </Routes>
      </MemoryRouter>
    </Providers>,
  )
}
