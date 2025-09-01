import { useTranslation } from 'react-i18next'
import { Appointment } from '../../types/appointment.type'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { BiCheck, BiError, BiSearch, BiX } from 'react-icons/bi'
import AppointmentPagination from '../../components/pagination/appointment.pagination'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '../../types/api.response.type'
import {
  HiCalendarDateRange,
  HiCalendarDays,
  HiCheckBadge,
  HiClipboardDocument,
  HiClock,
  HiMiniXCircle,
  HiPencilSquare,
  HiPhone
} from 'react-icons/hi2'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import ConfirmModal, {
  ConfirmModalRef
} from '../../components/modal/ConfirmModal'
import { showToast } from '../../utils/toast'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [appointmentData, setAppointmentData] = useState<Appointment[]>([])
  const [statusFilter, setStatusFilter] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)
  const confirmModalRef = useRef<ConfirmModalRef>(null)

  const fetchAppointmentData = async () => {
    setIsLoading(true)
    try {
      const result = await axios.get<ApiResponse<Appointment[]>>(
        `${import.meta.env.VITE_APP_API}/appointment/list`
      )
      setAppointmentData(result.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Axios error', error.response?.data.message)
      } else {
        console.error('Unexpected error', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onCancel = async (appId: string) => {
    try {
      const result = await axios.patch(
        `${import.meta.env.VITE_APP_API}/appointment/status/${appId}`
      )
      showToast({
        type: 'success',
        icon: BiCheck,
        message: result.data.message,
        duration: 3000,
        showClose: false
      })
      await fetchAppointmentData()
    } catch (error) {
      if (error instanceof AxiosError) {
        showToast({
          type: 'error',
          icon: BiError,
          message: error.response?.data.message,
          duration: error.response?.data.message.length > 27 ? 10000 : 3000,
          showClose: true
        })
      } else {
        console.error(error)
      }
    }
  }

  const onViewDetails = (appId: string) => {
    navigate(`/appointment/confirm/${appId}`)
  }

  useEffect(() => {
    fetchAppointmentData()
  }, [])

  const getStatusInfo = (step: number): { text: string; className: string } => {
    switch (step) {
      case 1:
        return { text: t('stepAppOne'), className: 'badge-warning' }
      case 2:
        return {
          text: t('stepAppTwo'),
          className: 'badge-success'
        }
      case 3:
        return {
          text: t('stepAppThree'),
          className: 'badge-info'
        }
      case 4:
        return { text: t('stepAppFour'), className: 'badge-accent' }
      case 5:
        return { text: t('stepAppFri'), className: 'badge-error' }
      default:
        return { text: 'ไม่ระบุสถานะ', className: 'badge-ghost' }
    }
  }

  const formatThaiDate = (dateString: string | null): string => {
    if (!dateString) return 'ไม่ได้ระบุ'
    try {
      const date = new Date(dateString)
      return format(date, 'd MMMM yyyy', { locale: th })
    } catch (error) {
      return 'รูปแบบวันที่ไม่ถูกต้อง'
    }
  }

  const renderMachineCard = (appointment: Appointment): ReactNode => {
    const status = getStatusInfo(appointment.f_appstepno)
    const formattedDueDate = formatThaiDate(appointment.f_appdoctorduedate)

    return (
      <div
        key={appointment.f_appidno}
        className={`card w-full max-w-sm bg-base-100 rounded-[40px] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
          status.text.includes(t('stepAppFri')) ? 'opacity-60' : ''
        }`}
      >
        <div className='card-body p-6'>
          <div className='flex items-center justify-between'>
            <h2 className='font-bold text-xl'>{t('helloMrs')}</h2>
            <div
              className={`badge badge-lg h-max py-1.5 ${status.className} text-xs font-semibold flex-shrink-0 text-center`}
            >
              {status.text}
            </div>
          </div>

          <div className='flex justify-between items-start gap-2 mb-4'>
            <div className='flex-1 min-w-0'>
              <h2
                className='card-title text-xl font-bold truncate'
                title={appointment.f_appcreateforname || 'ไม่ระบุชื่อ'}
              >
                {appointment.f_appcreateforname || 'ไม่ระบุชื่อ'}
              </h2>
              <p className='text-sm text-base-content/70 truncate'>
                HN: {appointment.f_appcreateforhn || '-'}
              </p>
            </div>
          </div>

          <div className='divider my-0'></div>

          <div className='space-y-3 mt-4 text-sm'>
            <div className='flex items-center gap-3'>
              <HiCalendarDays size={18} className='text-base-content/50' />
              <span className='font-semibold mr-1'>
                {t('dateAppointment')}:
              </span>
              <span>{formattedDueDate}</span>
            </div>
            <div className='flex items-center gap-3'>
              <HiPhone size={18} className='text-base-content/50' />
              <span className='font-semibold mr-1'>
                {t('appoientmentTel')}:
              </span>
              <span>{appointment.f_appcreatecontacttelephone || '-'}</span>
            </div>
          </div>

          <div className='card-actions mt-6'>
            <div className='flex gap-3 w-full'>
              {!status.text.includes(t('stepAppFour')) && (
                <button
                  onClick={async () => {
                    const confirmed = await confirmModalRef.current?.show({
                      title: t('cancelQueue'),
                      description: t('cancelQueueDescription'),
                      buttonConfirmText: t('okButton'),
                      type: 'error'
                    })

                    if (confirmed) {
                      onCancel(appointment.f_appidno)
                    }
                  }}
                  className={`btn btn-outline btn-error flex-1 rounded-3xl ${
                    status.text.includes('ยกเลิก') ? 'pointer-events-none' : ''
                  }`}
                >
                  <HiMiniXCircle size={20} />
                  {t('closeButton')}
                </button>
              )}
              <button
                onClick={() => onViewDetails(appointment.f_appidno)}
                className='btn btn-primary flex-2 rounded-3xl'
              >
                <HiPencilSquare size={20} />
                {t('viewAndEdit')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const sortedAndFilteredMachines = useMemo(() => {
    const filtered =
      statusFilter === 0
        ? appointmentData
        : appointmentData.filter(m => m.f_appstepno === statusFilter)

    const searchMachine = filtered.filter(
      m =>
        m.f_appcreateforname.toLowerCase().includes(search.toLowerCase()) ||
        m.f_appcreateforhn.toLowerCase().includes(search.toLowerCase())
    )

    return searchMachine
  }, [appointmentData, statusFilter, search])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div>
      {isLoading ? (
        <div className='flex items-center justify-center'>
          <span className='loading loading-spinner text-base-content loading-md'></span>
        </div>
      ) : (
        <>
          <div className='flex flex-col gap-3 mb-6'>
            <label className='input h-15 w-full rounded-3xl'>
              <BiSearch size={22} />
              <input
                type='text'
                placeholder={t('search')}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search.length > 0 && (
                <span
                  className='kbd kbd-md cursor-pointer'
                  onClick={() => setSearch('')}
                >
                  <BiX size={24} />
                </span>
              )}
            </label>
            <div
              role='tablist'
              className='tabs tabs-box bg-base-300 p-2 rounded-3xl'
            >
              <a
                role='tab'
                className={`tab h-13 px-5 !rounded-2xl ${
                  statusFilter === 0 ? 'tab-active' : ''
                }`}
                onClick={() => setStatusFilter(0)}
              >
                {t('filterAll')}
              </a>
              <a
                role='tab'
                className={`tab h-13 px-5 !rounded-2xl ${
                  statusFilter === 1 ? 'tab-active' : ''
                }`}
                onClick={() => setStatusFilter(1)}
              >
                <HiClock size={24} />
              </a>
              <a
                role='tab'
                className={`tab h-13 px-5 !rounded-2xl ${
                  statusFilter === 2 ? 'tab-active' : ''
                }`}
                onClick={() => setStatusFilter(2)}
              >
                <HiCalendarDateRange size={24} />
              </a>
              <a
                role='tab'
                className={`tab h-13 px-5 !rounded-2xl ${
                  statusFilter === 3 ? 'tab-active' : ''
                }`}
                onClick={() => setStatusFilter(3)}
              >
                <HiClipboardDocument size={24} />
              </a>
              <a
                role='tab'
                className={`tab h-13 px-5 !rounded-2xl ${
                  statusFilter === 4 ? 'tab-active' : ''
                }`}
                onClick={() => setStatusFilter(4)}
              >
                <HiCheckBadge size={24} />
              </a>
              <a
                role='tab'
                className={`tab h-13 px-5 !rounded-2xl ${
                  statusFilter === 5 ? 'tab-active' : ''
                }`}
                onClick={() => setStatusFilter(5)}
              >
                <HiMiniXCircle size={24} />
              </a>
            </div>
          </div>

          {sortedAndFilteredMachines.length == 0 ? (
            <div></div>
          ) : (
            <AppointmentPagination
              data={sortedAndFilteredMachines}
              initialPerPage={10}
              itemPerPage={[10, 50, 100]}
              renderItem={renderMachineCard}
            />
          )}
        </>
      )}

      <ConfirmModal ref={confirmModalRef} />
    </div>
  )
}

export default Home
