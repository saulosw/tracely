import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { anonymousSession, stubGraphQL } from '@/test/graphql'
import { renderWithProviders } from '@/test/renderWithProviders'
import { ConfirmDialog } from '.'


afterEach(() => {
  vi.unstubAllGlobals()
})

const renderDialog = (props: Partial<Parameters<typeof ConfirmDialog>[0]> = {}) => {
  const onConfirm = vi.fn()
  const onClose = vi.fn()
  stubGraphQL(() => anonymousSession())
  renderWithProviders(
    <ConfirmDialog
      open
      title="Desconectar GitHub?"
      description="Vamos apagar o acesso guardado."
      confirmLabel="Desconectar"
      onConfirm={onConfirm}
      onClose={onClose}
      {...props}
    />,
  )
  return { onConfirm, onClose }
}

describe('ConfirmDialog', () => {
  it('names itself by its title', () => {
    renderDialog()

    expect(screen.getByRole('dialog', { name: 'Desconectar GitHub?' })).toBeInTheDocument()
    expect(screen.getByText('Vamos apagar o acesso guardado.')).toBeInTheDocument()
  })

  it('stays closed while open is false', () => {
    renderDialog({ open: false })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes on the close icon without confirming', async () => {
    const user = userEvent.setup()
    const { onClose, onConfirm } = renderDialog()

    await user.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(onClose).toHaveBeenCalled()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('closes on a click outside without confirming', async () => {
    const user = userEvent.setup()
    const { onClose, onConfirm } = renderDialog()

    await user.click(document.querySelector('.MuiBackdrop-root') as HTMLElement)

    await waitFor(() => expect(onClose).toHaveBeenCalled())
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('confirms when the destructive action is accepted', async () => {
    const user = userEvent.setup()
    const { onConfirm } = renderDialog()

    await user.click(screen.getByRole('button', { name: 'Desconectar' }))

    expect(onConfirm).toHaveBeenCalled()
  })

  it('blocks cancelling while the confirmed action is still running', () => {
    renderDialog({ loading: true })

    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
  })
})
