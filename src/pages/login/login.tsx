import { useDispatch } from 'react-redux'
import { ChangeEvent, FormEvent, useState } from 'react'
import { HiEnvelope, HiLockClosed } from 'react-icons/hi2'
import { IoIosArrowBack } from 'react-icons/io'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import { showToast } from '../../utils/toast'
import { BiError } from 'react-icons/bi'
import { ApiResponse } from '../../types/api.response.type'
import { LoginResponse } from '../../types/login.type'
import {
  accessToken,
  cookieOptions,
  cookies
} from '../../constants/utils/utilsConstants'
import { setCookieEncode } from '../../redux/actions/utilsActions'

const Login = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [userForm, setUserForm] = useState({
    f_username: '',
    f_userpass: ''
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await axios.post<ApiResponse<LoginResponse>>(
        `${import.meta.env.VITE_APP_API}/auth/login`,
        userForm
      )
      const { f_id, f_userfullname, f_userstatus, token } = result.data.data

      const tokenObject = {
        f_id,
        f_userfullname,
        f_userstatus,
        token
      }
      cookies.set(
        'tokenObject',
        String(accessToken(tokenObject)),
        cookieOptions
      )
      cookies.update()
      dispatch(setCookieEncode(String(accessToken(tokenObject))))
      navigate(`/appointment`, { replace: true })
    } catch (error) {
      if (error instanceof AxiosError) {
        showToast({
          type: 'error',
          icon: BiError,
          message: error.response?.data.message,
          duration: error.response?.data.message.length > 27 ? 10000 : 1800,
          showClose: true
        })
      } else {
        console.error(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <div
        className={`fixed left-0 top-0 p-2 w-full rounded-b-3xl bg-base-100 shadow-md z-50 select-none`}
      >
        <div className='relative flex items-center justify-center h-10 overflow-hidden'>
          <button
            className={`btn btn-ghost text-primary active:text-primary/50 pr-2 pl-0 h-10 rounded-3xl absolute left-0`}
            onClick={() => navigate('/', { replace: true })}
          >
            <IoIosArrowBack size={24} />
            <span>{t('back')}</span>
          </button>
        </div>
        <div className={`flex flex-col items-center w- py-2`}>
          <h3 className='text-xl/8 font-bold text-center text-base-content text-wrap'>
            {t('appName')}
          </h3>
        </div>
      </div>

      <div className='h-screen flex items-center justify-center bg-base-200 p-4'>
        <div className='card w-full max-w-sm bg-base-100 rounded-[48px] shadow-xl'>
          <div className='card-body p-6'>
            <div className='text-center mb-6'>
              <h2 className='card-title justify-center text-3xl font-bold'>
                {t('welcome')}
              </h2>
              <p className='text-base-content/70 mt-2'>
                {t('welcomeDescription')}
              </p>
            </div>

            <form onSubmit={handleLogin} className='space-y-4'>
              <div className='form-control'>
                <label className='label' htmlFor='username-input'>
                  <span className='label-text'>{t('username')}</span>
                </label>
                <div className='flex items-center relative'>
                  <HiEnvelope
                    size={24}
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 z-10'
                  />
                  <input
                    id='username-input'
                    type='text'
                    className='input input-bordered w-full h-13 rounded-3xl pl-12'
                    autoFocus
                    value={userForm.f_username}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setUserForm({ ...userForm, f_username: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className='form-control'>
                <label className='label' htmlFor='password-input'>
                  <span className='label-text'>{t('password')}</span>
                </label>
                <div className='flex items-center relative'>
                  <HiLockClosed
                    size={24}
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 z-10'
                  />
                  <input
                    id='password-input'
                    type='password'
                    className='input input-bordered w-full h-13 rounded-3xl pl-12'
                    value={userForm.f_userpass}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setUserForm({ ...userForm, f_userpass: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className='form-control mt-6'>
                <button
                  type='submit'
                  className='btn btn-primary w-full h-13 rounded-3xl text-lg font-bold'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className='loading loading-spinner'></span>
                  ) : (
                    t('signIn')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
