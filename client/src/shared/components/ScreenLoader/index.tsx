import { LoaderRoot, Pulse } from './styles'


export function ScreenLoader() {
  return (
    <LoaderRoot role="status" aria-label="Carregando">
      <Pulse />
    </LoaderRoot>
  )
}
