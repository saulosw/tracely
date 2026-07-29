import { StatusPill } from '@/shared/components/StatusPill'
import { contentItems } from './contents'
import { OptionRow, OptionsRoot, RowDetail, RowHead, RowTitle } from './styles'


export function ContentOptions() {
  return (
    <OptionsRoot>
      {contentItems.map((item) => (
        <OptionRow key={item.title}>
          <RowHead>
            <RowTitle variant="sectionTitle">{item.title}</RowTitle>
            {item.pro ? <StatusPill tone="pro">Pro</StatusPill> : null}
          </RowHead>

          <RowDetail variant="fine">{item.detail}</RowDetail>

          <StatusPill tone={item.pro ? 'muted' : 'accent'}>
            {item.pro ? 'Bloqueado' : 'Incluído'}
          </StatusPill>
        </OptionRow>
      ))}
    </OptionsRoot>
  )
}
