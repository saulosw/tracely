import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import { ContentOptions } from '../ContentOptions'
import { FormSection } from '../FormSection'
import { PeriodPicker } from '../PeriodPicker'
import { SourcePicker } from '../SourcePicker'
import { StoryAdjustment } from '../StoryAdjustment'
import { TonePicker } from '../TonePicker'
import { Footer, SubmitButton, SubmitNote } from './styles'

import type { GenerationFormValues } from '../../schemas/generationSchema'
import { generationSchema } from '../../schemas/generationSchema'


export function GenerateForm() {
  const {
    control,
    register,
    formState: { errors },
  } = useForm<GenerationFormValues>({
    resolver: zodResolver(generationSchema),
    mode: 'onTouched',
    defaultValues: {
      period: 'last-chapter',
      from: '',
      to: '',
      sources: ['github'],
    },
  })


  return (
    <form noValidate>
      <FormSection
        title="Período"
        optional
        hint="Deixe como está e continuamos de onde seu último capítulo parou — ou escolha exatamente o que revisitar."
      >
        <Controller
          control={control}
          name="period"
          render={({ field }) => (
            <PeriodPicker
              value={field.value}
              onChange={field.onChange}
              register={register}
              errors={errors}
            />
          )}
        />
      </FormSection>

      <FormSection title="Fontes deste capítulo">
        <Controller
          control={control}
          name="sources"
          render={({ field }) => (
            <SourcePicker
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.sources?.message}
            />
          )}
        />
      </FormSection>

      <FormSection title="O que incluir">
        <ContentOptions />
      </FormSection>

      <FormSection title="Tom" pro hint="O controle de tom faz parte do Tracely Pro.">
        <TonePicker />
      </FormSection>

      <StoryAdjustment />

      <Footer>
        <SubmitButton type="submit" variant="solid" fullWidth disabled>
          Gerar minha história →
        </SubmitButton>
        <SubmitNote variant="fine">
          A geração de capítulos ainda não está disponível nesta versão.
        </SubmitNote>
      </Footer>
    </form>
  )
}
