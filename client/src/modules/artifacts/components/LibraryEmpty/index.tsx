import { Link } from 'react-router'

import { EmptyAction, EmptyMark, EmptyRoot, EmptyText, EmptyTitle } from './styles'


export function LibraryEmpty() {
  return (
    <EmptyRoot>
      <EmptyMark aria-hidden />

      <EmptyTitle variant="sectionTitle">Nenhum artefato ainda</EmptyTitle>

      <EmptyText variant="body2">
        Assim que você gerar o primeiro artefato, ele aparece aqui — organizado por tipo, do mais
        recente ao mais antigo.
      </EmptyText>

      <EmptyAction component={Link} to="/artifacts" variant="label">
        Gerar meu primeiro artefato →
      </EmptyAction>
    </EmptyRoot>
  )
}
