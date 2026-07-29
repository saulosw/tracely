import { TextField } from '@/shared/components/TextField'
import { OptionButton } from '../OptionButton'
import { periodOptions } from './periods'
import { CustomRange, PeriodGrid } from './styles'

import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { GenerationFormValues, GenerationPeriod } from '../../schemas/generationSchema'


type PeriodPickerProps = {
  value: GenerationPeriod
  onChange: (period: GenerationPeriod) => void
  register: UseFormRegister<GenerationFormValues>
  errors: FieldErrors<GenerationFormValues>
}

export function PeriodPicker({ value, onChange, register, errors }: PeriodPickerProps) {
  return (
    <>
      <PeriodGrid>
        {periodOptions.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            selected={value === option.value}
            onSelect={() => onChange(option.value)}
          />
        ))}
      </PeriodGrid>

      {value === 'custom' ? (
        <CustomRange>
          <TextField
            label="De"
            type="date"
            registration={register('from')}
            error={errors.from?.message}
          />
          <TextField
            label="Até"
            type="date"
            registration={register('to')}
            error={errors.to?.message}
          />
        </CustomRange>
      ) : null}
    </>
  )
}
