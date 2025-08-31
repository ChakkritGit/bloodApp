import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  HiCalendarDays,
  HiCog6Tooth,
  HiMiniArrowRightStartOnRectangle,
  HiMiniBars3BottomLeft,
  HiMiniMagnifyingGlass,
  HiUserGroup
} from 'react-icons/hi2'
import { Link, useLocation } from 'react-router-dom'
import ConfirmModal, { ConfirmModalRef } from '../modal/ConfirmModal'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'

const Navbar = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const confirmModalRef = useRef<ConfirmModalRef>(null)

  return (
    <div className='navbar bg-base-100 rounded-b-3xl shadow-md'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <div tabIndex={0} role='button' className='btn btn-ghost btn-circle'>
            <HiMiniBars3BottomLeft size={24} />
          </div>
          <ul
            tabIndex={0}
            className='menu dropdown-content gap-1 bg-base-100 rounded-4xl z-[1] mt-3 w-56 p-2 shadow-lg border border-base-200'
          >
            <li>
              <Link
                to='/appointment'
                className={`flex items-center h-12 rounded-3xl gap-2 text-base ${
                  location.pathname === '/appointment'
                    ? 'bg-primary text-base-100'
                    : ''
                }`}
              >
                <HiCalendarDays size={24} />
                <span>{t('manageAppointment')}</span>
              </Link>
            </li>
            <li>
              <Link
                to='/'
                className={`flex items-center h-12 rounded-3xl gap-2 text-base ${
                  location.pathname === '/' ? 'bg-primary text-base-100' : ''
                }`}
              >
                <HiMiniMagnifyingGlass size={24} />
                <span>{t('searchAppoinrment')}</span>
              </Link>
            </li>
            <li>
              <Link
                to='/appointment/user'
                className={`flex items-center h-12 rounded-3xl gap-2 text-base ${
                  location.pathname === '/appointment/user'
                    ? 'bg-primary text-base-100'
                    : ''
                }`}
              >
                <HiUserGroup size={24} />
                <span>{t('manageUser')}</span>
              </Link>
            </li>
            <li>
              <Link
                to='/appointment/setting'
                className={`flex items-center h-12 rounded-3xl gap-2 text-base ${
                  location.pathname === '/appointment/setting'
                    ? 'bg-primary text-base-100'
                    : ''
                }`}
              >
                <HiCog6Tooth size={24} />
                <span>{t('manageSetting')}</span>
              </Link>
            </li>
            <div className='divider my-0'></div>
            <li>
              <a
                onClick={async () => {
                  const confirmed = await confirmModalRef.current?.show({
                    title: t('logOutTitle'),
                    description: t('logOutDescription'),
                    buttonConfirmText: t('signOut'),
                    type: 'warning'
                  })

                  if (confirmed) {
                    cookies.remove('tokenObject', cookieOptions)
                    cookies.update()
                    window.location.href = '/'
                  }
                }}
                className={`flex items-center h-12 rounded-3xl gap-2 text-base text-red-500 active:!bg-red-500 active:!text-base-100 duration-300 ease-in-out`}
              >
                <HiMiniArrowRightStartOnRectangle size={24} />
                <span>{t('signOut')}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className='navbar-center'>
        <Link to='/appointment' className='btn btn-ghost text-base rounded-3xl'>
          {location.pathname === '/appointment'
            ? t('manageAppointment')
            : location.pathname === '/appointment/user'
            ? t('manageUser')
            : location.pathname === '/appointment/setting'
            ? t('manageSetting')
            : ''}
        </Link>
      </div>
      <div className='navbar-end'></div>
      <ConfirmModal ref={confirmModalRef} />
    </div>
  )
}

export default Navbar
