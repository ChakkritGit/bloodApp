import appLogo from '../../assets/images/appLogo.png'
import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { IoIosClose } from 'react-icons/io'
import { showToast } from '../../utils/toast'
import { BiError, BiErrorCircle } from 'react-icons/bi'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '../../types/api.response.type'

const Main = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [appointmentId, setAppointmentId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault()
    if (appointmentId.length !== 12) {
      showToast({
        type: 'warning',
        icon: BiErrorCircle,
        message: t('pleaseInputMoreThanTen'),
        duration: t('pleaseInputMoreThanTen').length > 27 ? 10000 : 1800,
        showClose: true
      })

      return
    }

    setIsLoading(true)
    try {
      const result = await axios.get<ApiResponse<string>>(
        `${import.meta.env.VITE_APP_API}/appointment/${appointmentId}`
      )

      if (result.data.data) {
        navigate(`/appointment/search/${appointmentId}`)
      } else {
        navigate(`/appointment/new/${appointmentId}`)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        showToast({
          type: 'error',
          icon: BiError,
          message: error.response?.data.message,
          duration: error.response?.data.message.length > 27 ? 10000 : 1800,
          showClose: false
        })
      } else {
        console.error(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-base-200 h-dvh'>
      <header className='fixed w-full bg-base-100 p-4 mx-auto shadow-sm border-b border-base-content/30 z-10'>
        <div className='flex justify-center items-center text-base-content/70'>
          <h1 className='text-xl font-bold text-center text-base-content truncate'>
            {t('appName')}
          </h1>
        </div>
      </header>

      <main className='flex justify-center items-center p-12 md:p-20 px-4 h-full'>
        <div className='card w-full max-w-sm bg-base-100 rounded-[48px] shadow-xl'>
          <form onSubmit={handleSearch} className='card-body gap-3'>
            <div className='avatar justify-center mb-5'>
              <div className='w-18 rounded-3xl'>
                <img src={appLogo} />
              </div>
            </div>

            <h4 className='card-title justify-center text-lg mb-5'>
              {t('searchAppointmentLabel')}
            </h4>

            <div className='form-control w-full'>
              <label
                className='input w-full h-13 rounded-3xl'
                htmlFor='appointmentId'
              >
                {appointmentId.length > 0 && <div className='w-8'></div>}
                <input
                  id='appointmentId'
                  type='number'
                  pattern='\d*'
                  minLength={10}
                  maxLength={10}
                  autoFocus
                  className='grow text-center font-bold text-xl h-13'
                  value={appointmentId}
                  onChange={e => {
                    if (e.target.value.length <= 12) {
                      setAppointmentId(e.target.value)
                    }
                  }}
                  required
                />
                {appointmentId.length > 0 && (
                  <kbd
                    className='kbd kbd-xl p-0 rounded-3xl'
                    onClick={() => setAppointmentId('')}
                  >
                    <IoIosClose size={24} />
                  </kbd>
                )}
              </label>
            </div>

            <div className='card-actions mt-5'>
              <button
                disabled={isLoading}
                className='btn btn-primary w-full h-13 rounded-3xl text-lg font-bold'
              >
                {isLoading ? (
                  <span className='loading loading-spinner loading-md'></span>
                ) : (
                  t('search')
                )}
              </button>
            </div>

            <div className='text-center'>
              <Link
                to='/appointment'
                className='btn w-full h-13 rounded-3xl text-lg font-bold'
              >
                {t('forOfficials')}
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Main
