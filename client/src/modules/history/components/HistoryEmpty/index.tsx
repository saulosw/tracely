import { Link } from 'react-router'

import { EmptyAction, EmptyMark, EmptyRoot, EmptyText, EmptyTitle } from './styles'


export function HistoryEmpty() {
  return (
    <EmptyRoot>
      <EmptyMark aria-hidden />

      <EmptyTitle variant="sectionTitle">Nenhum capítulo ainda</EmptyTitle>

      <EmptyText variant="body2">
        Assim que você gerar o primeiro capítulo, ele aparece aqui — e os próximos vão se
        empilhando acima dele.
      </EmptyText>

      <EmptyAction component={Link} to="/generate" variant="label">
        Escrever o primeiro capítulo →
      </EmptyAction>
    </EmptyRoot>
  )
}
