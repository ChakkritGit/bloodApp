import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const Main = () => {
  const { t } = useTranslation()
  const [appointmentId, setAppointmentId] = useState('')

  const handleSearch = () => {
    alert(`กำลังค้นหาเลขที่ใบนัด: ${appointmentId}`)
  }

  return (
    <div className='bg-base-200 font-sans h-dvh'>
      <main className='flex justify-center items-center p-12 md:p-20 px-4 h-full'>
        <div className='card w-full max-w-sm bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl'>
          <div className='card-body'>
            <h2 className='card-title justify-center text-2xl mb-6'>
              ค้นหาใบนัดหมาย
            </h2>

            <div className='form-control w-full'>
              <label className='label'>
                <span className='label-text'>{t('searchAppointment')}</span>
              </label>
              <input
                type='text'
                placeholder='ตัวอย่าง: APN6708001'
                className='input input-bordered w-full'
                value={appointmentId}
                onChange={e => setAppointmentId(e.target.value)}
              />
            </div>

            <div className='card-actions mt-6'>
              <button className='btn btn-primary w-full' onClick={handleSearch}>
                {t('search')}
              </button>
            </div>

            <div className='text-center mt-4'>
              <Link
                to='/appointment'
                className='link link-hover text-sm text-base-content/70'
              >
                {`> ${t('forOfficials')} <`}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Main
