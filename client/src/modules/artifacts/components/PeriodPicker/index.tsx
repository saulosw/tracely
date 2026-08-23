import { useController } from 'react-hook-form'

import { DateRangePicker } from '@/shared/components/DateRangePicker'
import { MAX_RANGE_DAYS } from '../../schemas/journalSchema'
import { OptionButton } from '../OptionButton'
import { periodOptions } from './periods'
import { PeriodGrid, RangeSlot } from './styles'

import type { Control, FieldErrors } from 'react-hook-form'
import type { ArtifactPeriod, JournalFormValues } from '../../schemas/journalSchema'


type PeriodPickerProps = {
  value: ArtifactPeriod
  onChange: (period: ArtifactPeriod) => void
  control: Control<JournalFormValues>
  errors: FieldErrors<JournalFormValues>
}

export function PeriodPicker({ value, onChange, control, errors }: PeriodPickerProps) {
  const from = useController({ control, name: 'from' })
  const to = useController({ control, name: 'to' })


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
        <RangeSlot>
          <DateRangePicker
            label="Período personalizado"
            value={{ from: from.field.value, to: to.field.value }}
            onChange={(range) => {
              from.field.onChange(range.from)
              to.field.onChange(range.to)
            }}
            onClose={() => {
              from.field.onBlur()
              to.field.onBlur()
            }}
            error={errors.from?.message ?? errors.to?.message}
            maxRangeDays={MAX_RANGE_DAYS}
          />
        </RangeSlot>
      ) : null}
    </>
  )
}
