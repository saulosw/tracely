import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { anonymousSession, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { todayKey } from './calendar'
import { DateRangePicker } from '.'

import type { DateRange } from '.'


afterEach(() => {
  vi.unstubAllGlobals()
})

const LABEL = 'Período personalizado'

type HarnessProps = {
  initial?: DateRange
  error?: string
  maxRangeDays?: number
  onPick?: (range: DateRange) => void
}

function Harness({ initial = { from: '', to: '' }, error, maxRangeDays, onPick }: HarnessProps) {
  const [value, setValue] = useState(initial)

  return (
    <DateRangePicker
      label={LABEL}
      value={value}
      onChange={(range) => {
        setValue(range)
        onPick?.(range)
      }}
      error={error}
      maxRangeDays={maxRangeDays}
    />
  )
}

const renderPicker = (props: HarnessProps = {}) => {
  stubGraphQL(() => anonymousSession())
  renderWithProviders(<Harness {...props} />, '/artifacts/journal')
  return userEvent.setup()
}

const namedField = (name: string) => name.startsWith(LABEL)

const field = () => screen.getByRole('button', { name: namedField })

const openCalendar = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(field())
  return screen.getByRole('dialog', { name: LABEL })
}

describe('DateRangePicker', () => {
  it('keeps the calendar out of the way until the field is opened', async () => {
    const user = renderPicker()

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(field()).toHaveTextContent('Selecione o período')

    await openCalendar(user)

    expect(screen.getByRole('dialog', { name: LABEL })).toBeInTheDocument()
  })

  it('reports the range the reader picked and steps aside', async () => {
    const onPick = vi.fn()
    const user = renderPicker({ initial: { from: '2026-01-10', to: '' }, onPick })

    const calendar = await openCalendar(user)
    await user.click(within(calendar).getByRole('button', { name: '5 de janeiro de 2026' }))
    await user.click(within(calendar).getByRole('button', { name: '9 de janeiro de 2026' }))

    expect(onPick).toHaveBeenLastCalledWith({ from: '2026-01-05', to: '2026-01-09' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(field()).toHaveTextContent('05/01/2026 — 09/01/2026')
  })

  it('starts the range over when the reader goes back before the first date', async () => {
    const onPick = vi.fn()
    const user = renderPicker({ initial: { from: '2026-01-10', to: '' }, onPick })

    const calendar = await openCalendar(user)
    await user.click(within(calendar).getByRole('button', { name: '20 de janeiro de 2026' }))
    await user.click(within(calendar).getByRole('button', { name: '3 de janeiro de 2026' }))

    expect(onPick).toHaveBeenLastCalledWith({ from: '2026-01-03', to: '' })
    expect(screen.getByRole('dialog', { name: LABEL })).toBeInTheDocument()
  })

  it('wipes the selection when asked to clear it', async () => {
    const onPick = vi.fn()
    const user = renderPicker({ initial: { from: '2026-01-05', to: '2026-01-09' }, onPick })

    const calendar = await openCalendar(user)
    await user.click(within(calendar).getByRole('button', { name: 'Limpar' }))
    await user.keyboard('{Escape}')

    expect(onPick).toHaveBeenLastCalledWith({ from: '', to: '' })
    expect(field()).toHaveTextContent('Selecione o período')
  })

  it('takes today as a range of its own', async () => {
    const onPick = vi.fn()
    const user = renderPicker({ onPick })

    const calendar = await openCalendar(user)
    await user.click(within(calendar).getByRole('button', { name: 'Hoje' }))

    expect(onPick).toHaveBeenLastCalledWith({ from: todayKey(), to: todayKey() })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('walks through months and years without leaving the calendar', async () => {
    const user = renderPicker({ initial: { from: '2026-01-10', to: '' } })

    const calendar = await openCalendar(user)
    expect(within(calendar).getByRole('button', { name: 'Janeiro 2026' })).toBeInTheDocument()

    await user.click(within(calendar).getByRole('button', { name: 'Próximo mês' }))
    expect(within(calendar).getByRole('button', { name: 'Fevereiro 2026' })).toBeInTheDocument()

    await user.click(within(calendar).getByRole('button', { name: 'Fevereiro 2026' }))
    await user.click(within(calendar).getByRole('button', { name: 'Próximo ano' }))
    await user.click(within(calendar).getByRole('button', { name: 'Março' }))

    expect(within(calendar).getByRole('button', { name: 'Março 2027' })).toBeInTheDocument()
    expect(within(calendar).getByRole('button', { name: '1 de março de 2027' })).toBeInTheDocument()
  })

  it('refuses the days that would stretch the range past the limit', async () => {
    const user = renderPicker({ initial: { from: '2026-01-10', to: '' }, maxRangeDays: 31 })

    const calendar = await openCalendar(user)
    await user.click(within(calendar).getByRole('button', { name: '10 de janeiro de 2026' }))
    await user.click(within(calendar).getByRole('button', { name: 'Próximo mês' }))

    expect(within(calendar).getByRole('button', { name: '10 de fevereiro de 2026' })).toBeEnabled()
    expect(
      within(calendar).getByRole('button', { name: '11 de fevereiro de 2026' }),
    ).toBeDisabled()
  })

  it('carries the validation message it was handed', () => {
    renderPicker({ error: 'Informe a data inicial.' })

    expect(screen.getByText('Informe a data inicial.')).toBeInTheDocument()
    expect(field()).toHaveAccessibleDescription('Informe a data inicial.')
  })
})
