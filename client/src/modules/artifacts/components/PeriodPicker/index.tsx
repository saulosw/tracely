import { TextField } from '@/shared/components/TextField'
import { OptionButton } from '../OptionButton'
import { periodOptions } from './periods'
import { CustomRange, PeriodGrid } from './styles'

import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { InsightPeriod, InsightsFormValues } from '../../schemas/insightsSchema'


type PeriodPickerProps = {
  value: InsightPeriod
  onChange: (period: InsightPeriod) => void
  register: UseFormRegister<InsightsFormValues>
  errors: FieldErrors<InsightsFormValues>
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
            disabled={option.pro}
            pro={option.pro}
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
