import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { useId, useState } from 'react'

import { Icon } from '@/shared/components/Icon'
import {
  addDays,
  cursorOf,
  dayNumber,
  describeDay,
  formatDay,
  monthDays,
  monthLabels,
  shiftMonth,
  todayKey,
  weekdayLabels,
} from './calendar'
import {
  Calendar,
  DayCell,
  DayGrid,
  FieldLabel,
  Footer,
  FooterAction,
  Header,
  MonthCell,
  MonthGrid,
  NavButton,
  Overlay,
  TitleButton,
  Trigger,
  Weekday,
  WeekdayRow,
} from './styles'

import type { MouseEvent } from 'react'
import type { MonthCursor } from './calendar'


export type DateRange = {
  from: string
  to: string
}

type DateRangePickerProps = {
  label: string
  value: DateRange
  onChange: (range: DateRange) => void
  onClose?: () => void
  error?: string
  maxRangeDays?: number
}

const PLACEHOLDER = 'Selecione o período'

const describeRange = ({ from, to }: DateRange): string => {
  if (!from) {
    return PLACEHOLDER
  }
  return to ? `${formatDay(from)} — ${formatDay(to)}` : `${formatDay(from)} — …`
}

export function DateRangePicker({
  label,
  value,
  onChange,
  onClose,
  error,
  maxRangeDays,
}: DateRangePickerProps) {
  const labelId = useId()
  const triggerId = useId()
  const messageId = `${triggerId}-message`

  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [browsingMonths, setBrowsingMonths] = useState(false)
  const [cursor, setCursor] = useState<MonthCursor>(() => cursorOf(value.from || todayKey()))
  const [pending, setPending] = useState<string | null>(null)

  const open = (event: MouseEvent<HTMLElement>) => {
    setCursor(cursorOf(value.from || todayKey()))
    setBrowsingMonths(false)
    setPending(null)
    setAnchor(event.currentTarget)
  }

  const close = () => {
    setAnchor(null)
    onClose?.()
  }

  const lastAllowed = pending && maxRangeDays ? addDays(pending, maxRangeDays) : null

  const selectDay = (day: string) => {
    if (!pending || day < pending) {
      setPending(day)
      onChange({ from: day, to: '' })
      return
    }
    onChange({ from: pending, to: day })
    close()
  }

  const selectToday = () => {
    const today = todayKey()
    onChange({ from: today, to: today })
    close()
  }

  const clear = () => {
    setPending(null)
    onChange({ from: '', to: '' })
  }

  const step = browsingMonths ? 12 : 1
  const anchorMonth = value.from ? cursorOf(value.from) : null


  return (
    <FormControl error={Boolean(error)}>
      <FieldLabel id={labelId}>{label}</FieldLabel>

      <Trigger
        id={triggerId}
        filled={Boolean(value.from)}
        onClick={open}
        aria-haspopup="dialog"
        aria-expanded={Boolean(anchor)}
        aria-labelledby={`${labelId} ${triggerId}`}
        aria-describedby={error ? messageId : undefined}
      >
        {describeRange(value)}
        <Icon name="calendar" />
      </Trigger>

      {error ? <FormHelperText id={messageId}>{error}</FormHelperText> : null}

      <Overlay
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Calendar role="dialog" aria-label={label}>
          <Header>
            <NavButton
              onClick={() => setCursor(shiftMonth(cursor, -step))}
              aria-label={browsingMonths ? 'Ano anterior' : 'Mês anterior'}
              disableRipple
            >
              <Icon name="chevron-left" />
            </NavButton>

            <TitleButton onClick={() => setBrowsingMonths(!browsingMonths)} disableRipple>
              {browsingMonths ? cursor.year : `${monthLabels[cursor.month]} ${cursor.year}`}
            </TitleButton>

            <NavButton
              onClick={() => setCursor(shiftMonth(cursor, step))}
              aria-label={browsingMonths ? 'Próximo ano' : 'Próximo mês'}
              disableRipple
            >
              <Icon name="chevron-right" />
            </NavButton>
          </Header>

          {browsingMonths ? (
            <MonthGrid>
              {monthLabels.map((month, index) => (
                <MonthCell
                  key={month}
                  selected={anchorMonth?.year === cursor.year && anchorMonth.month === index}
                  onClick={() => {
                    setCursor({ year: cursor.year, month: index })
                    setBrowsingMonths(false)
                  }}
                  disableRipple
                >
                  {month}
                </MonthCell>
              ))}
            </MonthGrid>
          ) : (
            <>
              <WeekdayRow>
                {weekdayLabels.map((weekday) => (
                  <Weekday key={weekday} variant="fine" aria-hidden>
                    {weekday}
                  </Weekday>
                ))}
              </WeekdayRow>

              <DayGrid>
                {monthDays(cursor).map((day, index) =>
                  day ? (
                    <DayCell
                      key={day}
                      selected={day === value.from || day === value.to}
                      inRange={Boolean(
                        value.from && value.to && day > value.from && day < value.to,
                      )}
                      disabled={Boolean(lastAllowed && day > lastAllowed)}
                      onClick={() => selectDay(day)}
                      aria-label={describeDay(day)}
                      disableRipple
                    >
                      {dayNumber(day)}
                    </DayCell>
                  ) : (
                    <Box key={`empty-${index}`} />
                  ),
                )}
              </DayGrid>
            </>
          )}

          <Footer>
            <FooterAction onClick={clear}>Limpar</FooterAction>
            <FooterAction onClick={selectToday}>Hoje</FooterAction>
          </Footer>
        </Calendar>
      </Overlay>
    </FormControl>
  )
}
