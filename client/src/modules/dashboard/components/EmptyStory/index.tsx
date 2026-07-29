import { Link } from 'react-router'

import { StoryRail } from '../StoryRail'
import { StorySteps } from '../StorySteps'
import {
  Closing,
  ConnectButton,
  Eyebrow,
  Glow,
  Lead,
  Rail,
  Steps,
  StoryRoot,
  Title,
} from './styles'


type EmptyStoryProps = {
  firstName?: string
}

export function EmptyStory({ firstName }: EmptyStoryProps) {
  const heading = firstName
    ? `${firstName}, sua história ainda não começou.`
    : 'Sua história ainda não começou.'


  return (
    <StoryRoot>
      <Glow aria-hidden />

      <Eyebrow variant="eyebrow">Primeiros passos</Eyebrow>

      <Rail>
        <StoryRail />
      </Rail>

      <Title variant="display">{heading}</Title>

      <Lead variant="lead">
        Conecte uma fonte e comece a escrever o primeiro capítulo.
      </Lead>

      <ConnectButton component={Link} to="/connect" variant="solid">
        Conectar uma fonte para começar →
      </ConnectButton>

      <Steps>
        <StorySteps />
      </Steps>

      <Closing variant="quote">
        Todo capítulo começa da mesma forma — com o próximo commit.
      </Closing>
    </StoryRoot>
  )
}
