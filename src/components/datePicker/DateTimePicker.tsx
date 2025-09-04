import React, { FC, useState, useEffect, useRef } from 'react'
import { format, parseISO, setHours, setMinutes } from 'date-fns'
import { th } from 'date-fns/locale'
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker'

interface DateTimePickerProps {
  value: string
  onChange: (isoString: string) => void
  placeholder?: string
}

const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = Math.floor(i / 2)
    .toString()
    .padStart(2, '0')
  const minute = i % 2 === 0 ? '00' : '30'
  return `${hour}:${minute}`
})

export const DateTimePicker: FC<DateTimePickerProps> = ({
  value,
  onChange,
  placeholder = 'กรุณาเลือกวันที่และเวลา'
}) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>(
    value ? parseISO(value) : undefined
  )

  const formattedDisplayValue = selectedDateTime
    ? format(selectedDateTime, 'd MMM yyyy, HH:mm', { locale: th }) + ' น.'
    : placeholder

  const handleDaySelect: SelectSingleEventHandler = date => {
    if (!date) return
    const currentHour = selectedDateTime ? selectedDateTime.getHours() : 8
    const currentMinute = selectedDateTime ? selectedDateTime.getMinutes() : 0

    let newDate = setHours(date, currentHour)
    newDate = setMinutes(newDate, currentMinute)

    setSelectedDateTime(newDate)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [hour, minute] = e.target.value.split(':').map(Number)

    const baseDate = selectedDateTime || new Date()

    let newDate = setHours(baseDate, hour)
    newDate = setMinutes(newDate, minute)

    setSelectedDateTime(newDate)
  }

  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (selectedDateTime) {
      const isoString = format(selectedDateTime, "yyyy-MM-dd'T'HH:mm")

      if (isoString !== value) {
        onChangeRef.current(isoString)
      }
    }
  }, [selectedDateTime, value])

  return (
    <div className='dropdown w-full'>
      <label
        tabIndex={0}
        className={`input input-bordered text-primary border-primary w-full h-13 rounded-3xl flex items-center justify-between cursor-pointer ${
          value === '' ? 'opacity-50' : ''
        }`}
      >
        <span>{formattedDisplayValue}</span>
      </label>
      <div
        tabIndex={0}
        className='dropdown-content z-[1] menu p-4 shadow bg-base-100 rounded-box w-auto'
      >
        <DayPicker
          mode='single'
          selected={selectedDateTime}
          onSelect={handleDaySelect}
          locale={th}
          defaultMonth={selectedDateTime || new Date()}
        />

        <div className='divider my-2'></div>

        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>เลือกเวลา</span>
          </label>
          <select
            className='select select-bordered'
            value={
              selectedDateTime ? format(selectedDateTime, 'HH:mm') : '08:00'
            }
            onChange={handleTimeChange}
          >
            {timeOptions.map(time => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
