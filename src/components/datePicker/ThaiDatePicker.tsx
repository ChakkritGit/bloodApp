import { FC } from 'react'
import { format, isValid } from 'date-fns'
import { th } from 'date-fns/locale'
import { DayPicker } from 'react-day-picker'

interface ThaiDatePickerProps {
  value: string | null | undefined
  onChange: (date: string) => void
  placeholder?: string
}

export const ThaiDatePicker: FC<ThaiDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'กรุณาเลือกวันที่'
}) => {
  const parsedDate = value ? new Date(value) : undefined
  const selectedDate =
    parsedDate && isValid(parsedDate) ? parsedDate : undefined

  const formattedDisplayDate = selectedDate
    ? format(selectedDate, 'd MMMM yyyy', { locale: th })
    : placeholder

  const handleDaySelect = (date: Date | undefined) => {
    if (date && isValid(date)) {
      onChange(format(date, 'yyyy-MM-dd'))
    }
  }

  return (
    <div className='dropdown w-full'>
      <label
        tabIndex={0}
        className={`input input-bordered text-primary border-primary w-full h-13 rounded-3xl flex items-center justify-between cursor-pointer ${
          !selectedDate ? 'opacity-50' : ''
        }`}
      >
        <span>{formattedDisplayDate}</span>
      </label>
      <div
        tabIndex={0}
        className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box'
      >
        <DayPicker
          mode='single'
          selected={selectedDate}
          onSelect={handleDaySelect}
          locale={th}
          defaultMonth={selectedDate}
        />
      </div>
    </div>
  )
}
