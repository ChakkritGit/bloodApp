import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  HiCalendarDays,
  HiChevronDown,
  HiChevronUp,
  HiCog6Tooth,
  HiHome,
  HiLanguage,
  HiMiniArrowRightStartOnRectangle,
  HiMiniBars3BottomLeft,
  HiMiniMagnifyingGlass,
  HiUserGroup
} from 'react-icons/hi2'
import { Link, useLocation } from 'react-router-dom'
import ConfirmModal, { ConfirmModalRef } from '../modal/ConfirmModal'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'
import { RootState } from '../../redux/reducers/rootReducer'
import { useDispatch, useSelector } from 'react-redux'
import { setLanguage } from '../../redux/actions/utilsActions'

const Navbar = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { currentLang } = useSelector((state: RootState) => state.utils)
  const location = useLocation()
  const confirmModalRef = useRef<ConfirmModalRef>(null)
  const [toggleLang, setToggleLang] = useState(false)

  const setLang = (lang: string) => {
    dispatch(setLanguage(lang))
  }

  return (
    <div
      className={`navbar ${
        !location.pathname.startsWith('/appointment/confirm')
          ? 'bg-base-100/30 backdrop-blur-xl shadow-md rounded-b-xl'
          : 'bg-base-100'
      } top-0 left-0 sticky z-50`}
    >
      <div className='navbar-start'>
        <div className='dropdown'>
          <div tabIndex={0} role='button' className='btn btn-ghost btn-circle'>
            <HiMiniBars3BottomLeft size={24} />
          </div>
          <ul
            tabIndex={0}
            className='menu dropdown-content gap-1 bg-base-100 rounded-4xl z-[1] mt-3 w-60 p-2 shadow-lg border border-base-200'
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
            <li className='dropdown dropdown-end w-full'>
              <button
                className='btn rounded-3xl w-full'
                popoverTarget='popover-1'
                onClick={() => setToggleLang(!toggleLang)}
              >
                <HiLanguage size={24} />
                <span>{currentLang === 'th' ? 'ไทย' : 'English'}</span>
                {toggleLang ? (
                  <HiChevronUp size={20} />
                ) : (
                  <HiChevronDown size={20} />
                )}
              </button>

              <ul
                className='dropdown menu min-w-42 rounded-[34px] bg-base-300 shadow-sm p-2.5 flex gap-1.5'
                popover='auto'
                id='popover-1'
              >
                <li onClick={() => setLang('th')}>
                  <a
                    className={`flex flex-row gap-2 h-11 w-full rounded-3xl ${
                      currentLang === 'th' ? 'bg-primary text-neutral' : ''
                    }`}
                  >
                    <span className='font-bold'>TH</span>
                    <span>ไทย</span>
                  </a>
                </li>
                <li onClick={() => setLang('en')}>
                  <a
                    className={`flex flex-row gap-2 h-11 w-full rounded-3xl ${
                      currentLang === 'en' ? 'bg-primary text-neutral' : ''
                    }`}
                  >
                    <span className='font-bold'>EN</span>
                    <span>English</span>
                  </a>
                </li>
              </ul>
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
          {location.pathname === '/appointment' ? (
            t('manageAppointment')
          ) : location.pathname === '/appointment/user' ? (
            t('manageUser')
          ) : location.pathname === '/appointment/setting' ? (
            t('manageSetting')
          ) : (
            <HiHome size={24} />
          )}
        </Link>
      </div>
      <div className='navbar-end'></div>
      <ConfirmModal ref={confirmModalRef} />
    </div>
  )
}

export default Navbar
