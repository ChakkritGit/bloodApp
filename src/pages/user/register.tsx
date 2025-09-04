import axios, { AxiosError } from 'axios'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiCheck, BiError } from 'react-icons/bi'
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2'
import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../../utils/toast'
import { ApiResponse } from '../../types/api.response.type'
import { UserRegister } from '../../types/login.type'

interface RegisterFormData {
  username: string
  fullName: string
  password: string
}

type FormErrors = Partial<Record<keyof RegisterFormData, string>>

const Register = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    fullName: '',
    password: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isButtonFixed, setIsButtonFixed] = useState(false)
  const paragraphRef = useRef<HTMLHeadingElement>(null)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'กรุณากรอกชื่อ-นามสกุล'
    if (!formData.username.trim()) newErrors.username = 'กรุณากรอกชื่อผู้ใช้'
    if (formData.password.length < 8)
      newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const result = await axios.post<ApiResponse<UserRegister>>(
        `${import.meta.env.VITE_APP_API}/auth/register`,
        {
          f_username: formData.username,
          f_userpass: formData.password,
          f_userfullname: formData.fullName
        }
      )
      showToast({
        type: 'success',
        icon: BiCheck,
        message: result.data.message,
        duration: 3000,
        showClose: false
      })
      navigate(`/appointment/user`, {
        replace: true
      })
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

  useEffect(() => {
    const handleScroll = () => {
      if (paragraphRef.current) {
        if (paragraphRef.current.getBoundingClientRect().bottom < 16) {
          setIsButtonFixed(true)
        } else {
          setIsButtonFixed(false)
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className='min-h-screen'>
      <button
        className={`btn btn-ghost text-primary active:text-primary/50 pr-2 pl-0 h-10 select-none rounded-3xl transition-all ${
          isButtonFixed ? 'invisible' : 'visible'
        }`}
        onClick={() => navigate(-1)}
      >
        <IoIosArrowBack size={24} />
        <span>{t('back')}</span>
      </button>

      <div
        className={`fixed left-0 top-0 p-2 w-full rounded-b-3xl bg-base-100/30 backdrop-blur-xl shadow-md z-50 select-none transition-all duration-300 ease-in-out ${
          isButtonFixed
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0'
        }`}
      >
        <div className='relative flex items-center justify-center h-10 overflow-hidden'>
          <button
            className={`btn btn-ghost text-primary active:text-primary/50 pr-2 pl-0 h-10 rounded-3xl absolute left-0 transition-all duration-300 ${
              isButtonFixed ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => navigate(-1)}
          >
            <IoIosArrowBack size={24} />
            <span>{t('back')}</span>
          </button>
          <div
            className={`flex flex-col items-center cursor-pointer transition-all duration-300 ease-in-out ${
              isButtonFixed
                ? 'translate-y-0 opacity-100 delay-100'
                : 'translate-y-5 opacity-0'
            }`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className='text-xs'>{t('register')}</span>
          </div>
        </div>
      </div>

      <div className='max-w-4xl mx-auto pt-8'>
        <header
          className={`text-center transition-all duration-300 ease-in-out ${
            isButtonFixed ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <h1 ref={paragraphRef} className='text-3xl font-bold'>
            {t('createNewAccount')}
          </h1>
          <p className='text-base-content/70 mt-2'>{t('fillInfoToStart')}</p>
        </header>

        <div
          className={`card w-full bg-base-100 shadow-xl rounded-[48px] transition-all duration-300 ease-in-out ${
            isButtonFixed ? 'mt-20' : 'mt-8'
          }`}
        >
          <form onSubmit={handleSubmit} className='card-body gap-4'>
            <section>
              <h3 className='text-lg font-semibold border-b pb-2 mb-4'>
                {t('accountInfo')}
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>{t('fullName')}</span>
                  </label>
                  <input
                    type='text'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`input input-bordered h-13 rounded-3xl w-full ${
                      errors.fullName ? 'input-error' : ''
                    }`}
                  />
                  {errors.fullName && (
                    <label className='label'>
                      <span className='label-text-alt text-error'>
                        {errors.fullName}
                      </span>
                    </label>
                  )}
                </div>

                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>{t('username')}</span>
                  </label>
                  <input
                    type='text'
                    name='username'
                    value={formData.username}
                    onChange={handleChange}
                    className={`input input-bordered h-13 rounded-3xl w-full ${
                      errors.username ? 'input-error' : ''
                    }`}
                  />
                  {errors.username && (
                    <label className='label'>
                      <span className='label-text-alt text-error'>
                        {errors.username}
                      </span>
                    </label>
                  )}
                </div>

                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>{t('password')}</span>
                  </label>
                  <label
                    className={`input input-bordered h-13 rounded-3xl flex items-center gap-2 ${
                      errors.password ? 'input-error' : ''
                    }`}
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                      value={formData.password}
                      onChange={handleChange}
                      className='grow'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='btn btn-ghost btn-sm btn-circle'
                    >
                      {showPassword ? (
                        <HiOutlineEyeSlash size={16} />
                      ) : (
                        <HiOutlineEye size={16} />
                      )}
                    </button>
                  </label>
                  {errors.password && (
                    <label className='label'>
                      <span className='label-text-alt text-error'>
                        {errors.password}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </section>

            <div className='card-actions flex-col justify-between border-t pt-6'>
              <button
                type='submit'
                disabled={isLoading}
                className='btn btn-primary w-full h-13 rounded-3xl text-lg font-bold'
              >
                {isLoading ? (
                  <span className='loading loading-spinner'></span>
                ) : (
                  t('registerButton')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
