import { OptionButton } from '../OptionButton'
import { categoryOptions } from './categories'
import { CategoryError, CategoryGrid } from './styles'

import type { InsightCategory } from '../../schemas/insightsSchema'


type CategoryPickerProps = {
  value: InsightCategory[]
  onChange: (categories: InsightCategory[]) => void
  onBlur: () => void
  error?: string
}

export function CategoryPicker({ value, onChange, onBlur, error }: CategoryPickerProps) {
  const toggle = (category: InsightCategory) =>
    onChange(
      value.includes(category)
        ? value.filter((current) => current !== category)
        : [...value, category],
    )


  return (
    <>
      <CategoryGrid>
        {categoryOptions.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            selected={value.includes(option.value)}
            onSelect={() => toggle(option.value)}
            onBlur={onBlur}
          />
        ))}
      </CategoryGrid>

      {error ? <CategoryError variant="fine">{error}</CategoryError> : null}
    </>
  )
}
