import { useId } from 'react'

import { Icon } from '@/shared/components/Icon'
import {
  CloseButton,
  Description,
  DialogRoot,
  Footer,
  FooterButton,
  Head,
  Title,
} from './styles'


type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancelar',
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const titleId = useId()


  return (
    <DialogRoot open={open} onClose={onClose} aria-labelledby={titleId}>
      <Head>
        <Title id={titleId} variant="sectionTitle">
          {title}
        </Title>

        <CloseButton onClick={onClose} aria-label="Fechar" disableRipple>
          <Icon name="close" />
        </CloseButton>
      </Head>

      <Description variant="body2">{description}</Description>

      <Footer>
        <FooterButton onClick={onClose} disabled={loading}>
          {cancelLabel}
        </FooterButton>
        <FooterButton variant="solid" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </FooterButton>
      </Footer>
    </DialogRoot>
  )
}
