import { steps } from './steps'
import { StepDetail, StepItem, StepNumber, StepsRoot, StepTitle } from './styles'


export function StorySteps() {
  return (
    <StepsRoot component="ol">
      {steps.map((step, index) => (
        <StepItem key={step.title} component="li" current={index === 0}>
          <StepNumber variant="meta" current={index === 0}>
            {String(index + 1).padStart(2, '0')}
          </StepNumber>
          <StepTitle variant="sectionTitle">{step.title}</StepTitle>
          <StepDetail variant="fine">{step.detail}</StepDetail>
        </StepItem>
      ))}
    </StepsRoot>
  )
}
