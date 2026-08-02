import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import { CategoryPicker } from '../CategoryPicker'
import { FormSection } from '../FormSection'
import { PeriodPicker } from '../PeriodPicker'
import { SourcePicker } from '../SourcePicker'
import { Footer, SubmitButton, SubmitNote } from './styles'

import type { InsightsFormValues } from '../../schemas/insightsSchema'
import { insightCategories, insightsSchema } from '../../schemas/insightsSchema'


export function InsightsForm() {
  const {
    control,
    register,
    formState: { errors },
  } = useForm<InsightsFormValues>({
    resolver: zodResolver(insightsSchema),
    mode: 'onTouched',
    defaultValues: {
      period: 'week',
      from: '',
      to: '',
      sources: [],
      categories: [...insightCategories],
    },
  })


  return (
    <form noValidate>
      <FormSection
        title="Período"
        hint="Um intervalo personalizado vai até um mês. O ano inteiro faz parte do Tracely Pro."
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

      <FormSection title="Fontes">
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
        title="O que entra no insight"
        hint="Cada categoria vira um número, um gráfico ou um padrão no painel."
      >
        <Controller
          control={control}
          name="categories"
          render={({ field }) => (
            <CategoryPicker
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.categories?.message}
            />
          )}
        />
      </FormSection>

      <Footer>
        <SubmitButton type="submit" variant="solid" fullWidth disabled>
          Gerar meus insights →
        </SubmitButton>
        <SubmitNote variant="fine">
          A geração de insights ainda não está disponível nesta versão.
        </SubmitNote>
      </Footer>
    </form>
  )
}
