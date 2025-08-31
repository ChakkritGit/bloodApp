import { useTranslation } from 'react-i18next'
import { Appointment } from '../../types/appointment.type'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import {
  IoMdCheckmarkCircleOutline,
  IoMdCloseCircleOutline
} from 'react-icons/io'
import { BiSearch, BiX } from 'react-icons/bi'
import AppointmentPagination from '../../components/pagination/appointment.pagination'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '../../types/api.response.type'
import {
  HiCalendarDateRange,
  HiCheckBadge,
  HiClipboardDocument,
  HiClock,
  HiMiniXCircle,
  HiOutlineCalendarDays,
  HiOutlinePencilSquare,
  HiOutlinePhone,
  HiOutlineTrash
} from 'react-icons/hi2'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

const Home = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [appointmentData, setAppointmentData] = useState<Appointment[]>([])
  const [statusFilter, setStatusFilter] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)

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

  useEffect(() => {
    fetchAppointmentData()
  }, [])

  const getStatusInfo = (step: number): { text: string; className: string } => {
    switch (step) {
      case 1:
        return { text: 'รอพิจารณาและยืนยันรายการ', className: 'badge-warning' }
      case 2:
        return {
          text: 'ยืนยันรายการและวันนัดหมายแล้ว',
          className: 'badge-success'
        }
      case 3:
        return {
          text: 'เตรียมการและเอกสารเพื่อเข้าตรวจตามนัด',
          className: 'badge-info'
        }
      case 4:
        return { text: 'เข้าดำเนินการตรวจแล้ว', className: 'badge-accent' }
      case 5:
        return { text: 'ยกเลิกการนัดหมาย', className: 'badge-error' }
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
          status.text.includes('ยกเลิก') ? 'opacity-60' : ''
        }`}
      >
        <div className='card-body p-6'>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <h2 className='card-title text-xl font-bold'>
                คุณ {appointment.f_appcreateforname || 'ไม่ระบุชื่อ'}
              </h2>
              <p className='text-sm text-base-content/70'>
                HN: {appointment.f_appcreateforhn || '-'}
              </p>
            </div>
            <div
              className={`badge badge-lg ${status.className} text-xs font-semibold`}
            >
              {status.text}
            </div>
          </div>

          <div className='divider my-0'></div>

          <div className='space-y-3 mt-4 text-sm'>
            <div className='flex items-center gap-3'>
              <HiOutlineCalendarDays className='w-4 h-4 text-base-content/50' />
              <span className='font-semibold mr-1'>วันที่นัดหมาย:</span>
              <span>{formattedDueDate}</span>
            </div>
            <div className='flex items-center gap-3'>
              <HiOutlinePhone className='w-4 h-4 text-base-content/50' />
              <span className='font-semibold mr-1'>เบอร์โทรติดต่อ:</span>
              <span>{appointment.f_appcreatecontacttelephone || '-'}</span>
            </div>
          </div>

          <div className='card-actions mt-6'>
            <div className='flex gap-3 w-full'>
              <button
                // onClick={() => onCancel(appointment.f_appidno)}
                className='btn btn-outline btn-error flex-1 rounded-3xl'
              >
                <HiOutlineTrash className='h-5 w-5' />
                ยกเลิก
              </button>
              <button
                // onClick={() => onViewDetails(appointment.f_appidno)}
                className='btn btn-primary flex-1 rounded-3xl'
              >
                <HiOutlinePencilSquare className='h-5 w-5' />
                ดู/แก้ไข
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
    </div>
  )
}

export default Home
