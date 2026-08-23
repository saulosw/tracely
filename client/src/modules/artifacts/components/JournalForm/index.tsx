import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { syncConnections, useConnectionSources } from '@/modules/connections'
import { FormAlert } from '@/shared/components/FormAlert'
import { describeArtifactError } from '../../services/artifactErrors'
import { connectionIdsOf, generateJournal, providersOf } from '../../services/artifactsApi'
import { FormSection } from '../FormSection'
import { PeriodPicker } from '../PeriodPicker'
import { SourcePicker } from '../SourcePicker'
import { TonePicker } from '../TonePicker'
import { Footer, SubmitButton } from './styles'

import type { JournalFormValues } from '../../schemas/journalSchema'
import { journalSchema } from '../../schemas/journalSchema'


export function JournalForm() {
  const navigate = useNavigate()
  const sources = useConnectionSources()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JournalFormValues>({
    resolver: zodResolver(journalSchema),
    mode: 'onTouched',
    defaultValues: {
      period: 'week',
      from: '',
      to: '',
      sources: [],
    },
  })

  const onSubmit = async (values: JournalFormValues) => {
    setFormError(null)
    try {
      await syncConnections(connectionIdsOf(values.sources, sources))
      const artifact = await generateJournal({
        period: values.period,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ...(values.period === 'custom' ? { from: values.from, to: values.to } : {}),
        providers: providersOf(values.sources, sources),
      })
      navigate(`/artifacts/journal/${artifact.id}`)
    } catch (error) {
      setFormError(describeArtifactError(error))
    }
  }


  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormSection
        title="Período"
        hint="Um intervalo personalizado vai até 31 dias. O ano inteiro faz parte do Tracely Pro."
      >
        <Controller
          control={control}
          name="period"
          render={({ field }) => (
            <PeriodPicker
              value={field.value}
              onChange={field.onChange}
              control={control}
              errors={errors}
            />
          )}
        />
      </FormSection>

      <FormSection title="Fontes" hint="O diário lê a atividade das fontes que você escolher.">
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

      <FormSection
        title="Tom"
        pro
        hint="Reescrever o diário com outra voz faz parte do Tracely Pro."
      >
        <TonePicker />
      </FormSection>

      <Footer>
        {formError ? <FormAlert>{formError}</FormAlert> : null}

        <SubmitButton type="submit" variant="solid" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Lendo sua atividade…' : 'Gerar meu diário →'}
        </SubmitButton>
      </Footer>
    </form>
  )
}
