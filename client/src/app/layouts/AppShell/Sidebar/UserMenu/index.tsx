import { useState } from 'react'

import { useAuth } from '@/modules/auth'
import { Icon } from '@/shared/components/Icon'
import {
  Action,
  ActionLabel,
  AccountEmail,
  AccountName,
  Avatar,
  Identity,
  Initial,
  Popover,
  Trigger,
} from './styles'

import type { AuthUser } from '@/modules/auth'


type UserMenuProps = {
  user: AuthUser
}

export function UserMenu({ user }: UserMenuProps) {
  const { signOut } = useAuth()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)


  return (
    <>
      <Trigger
        onClick={(event) => setAnchor(event.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchor)}
        aria-label={`Conta de ${user.firstName}`}
        disableRipple
      >
        <Avatar>
          <Initial variant="meta">{user.firstName.charAt(0).toUpperCase()}</Initial>
        </Avatar>

        <Identity>
          <AccountName variant="label">{user.firstName}</AccountName>
          <AccountEmail variant="meta">{user.email}</AccountEmail>
        </Identity>
      </Trigger>

      <Popover
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Action
          onClick={() => {
            setAnchor(null)
            void signOut()
          }}
        >
          <Icon name="logout" />
          <ActionLabel variant="label">Sair</ActionLabel>
        </Action>
      </Popover>
    </>
  )
}
