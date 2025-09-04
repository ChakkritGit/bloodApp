import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HiMapPin, HiPhoto } from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'
import { IoIosArrowBack, IoIosClose, IoIosRemove } from 'react-icons/io'
import { showToast } from '../../utils/toast'
import { BiCheck, BiError, BiErrorCircle } from 'react-icons/bi'
import { AppointmentState } from '../../types/appointment.type'
import { resizeImage } from '../../constants/utils/image'
import { ApiResponse } from '../../types/api.response.type'
import axios, { AxiosError } from 'axios'
import LocationMap from '../../utils/LocationMap'
import { ThaiDatePicker } from '../../components/datePicker/ThaiDatePicker'

const AppointmentNew = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [isButtonFixed, setIsButtonFixed] = useState(false)
  const [appointmentData, setAppointmentData] = useState<AppointmentState>({
    f_appidno: id,
    f_appcreatebyname: '',
    f_appcreateforhn: '',
    f_appcreateforname: '',
    f_appcreatecontacttelephone: '',
    f_appcreatecontacttelephonetwo: '',
    f_appcreatecontactaddress: '',
    f_appcreatecontactlat: '',
    f_appcreatecontactlon: '',
    f_appdoctorduedate: '',
    f_apppictureappdoc: '',
    selectedFile: null
  })
  const [consent, setConsent] = useState(false)
  const [isImageResizing, setIsImageResizing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const paragraphRef = useRef<HTMLHeadingElement>(null)

  const handleSubmit = async () => {
    const fields = {
      f_appidno: appointmentData.f_appidno,
      f_appcreatebyname: appointmentData.f_appcreatebyname,
      f_appcreateforhn: appointmentData.f_appcreateforhn,
      f_appcreateforname: appointmentData.f_appcreateforname,
      f_appcreatecontacttelephone: appointmentData.f_appcreatecontacttelephone,
      f_appcreatecontacttelephonetwo:
        appointmentData.f_appcreatecontacttelephonetwo,
      f_appcreatecontactaddress: appointmentData.f_appcreatecontactaddress,
      f_appcreatecontactlat: appointmentData.f_appcreatecontactlat,
      f_appcreatecontactlon: appointmentData.f_appcreatecontactlon,
      f_appdoctorduedate: appointmentData.f_appdoctorduedate,
      appointmentDoc: appointmentData.selectedFile
    }

    const optionalFields = ['f_appcreatecontacttelephonetwo']

    const emptyFields = Object.entries(fields).filter(
      ([key, value]) =>
        !optionalFields.includes(key) &&
        (value === null || value === undefined || value === '')
    )

    if (emptyFields.length > 0) {
      showToast({
        type: 'warning',
        icon: BiErrorCircle,
        message: `กรุณากรอกข้อมูลให้ครบ`,
        duration: 5000,
        showClose: true
      })
      return
    }

    const formData = new FormData()
    Object.entries(fields).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value)
      } else if (value !== null && value !== undefined && value !== '') {
        formData.append(key, String(value))
      }
    })

    try {
      const result = await axios.post<ApiResponse<string>>(
        `${import.meta.env.VITE_APP_API}/appointment`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      showToast({
        type: 'success',
        icon: BiCheck,
        message: result.data.message,
        duration: 3000,
        showClose: false
      })

      navigate(`/appointment/search/${appointmentData.f_appidno}`, {
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
    }
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setAppointmentData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        await showToast({
          type: 'error',
          icon: BiError,
          message: t('imageSizeLimit'),
          duration: 2000,
          showClose: false
        }).finally(async () => {
          setAppointmentData({
            ...appointmentData,
            selectedFile: null,
            f_apppictureappdoc: ''
          })
        })
        return
      }

      await new Promise(resolve => setTimeout(resolve, 500))
      setIsImageResizing(true)
      const reSized = await resizeImage(file).finally(() =>
        setIsImageResizing(false)
      )
      setAppointmentData(prev => ({
        ...prev,
        selectedFile: reSized,
        f_apppictureappdoc: URL.createObjectURL(file)
      }))
    }
  }

  const handleRemoveImage = () => {
    setAppointmentData({
      ...appointmentData,
      selectedFile: null,
      f_apppictureappdoc: ''
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setAppointmentData(prev => ({
            ...prev,
            f_appcreatecontactlat: position.coords.latitude.toString(),
            f_appcreatecontactlon: position.coords.longitude.toString()
          }))
        },
        error => {
          console.error('Error getting location:', error)
          showToast({
            type: 'error',
            icon: BiError,
            message: 'ไม่สามารถดึงพิกัดได้',
            duration: 2000,
            showClose: false
          })
        }
      )
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

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className='min-h-screen bg-base-200 p-4'>
      <button
        className={`btn btn-ghost text-primary active:text-primary/50 pr-2 pl-0 h-10 select-none rounded-3xl transition-all ${
          isButtonFixed ? 'invisible' : 'visible'
        }`}
        onClick={() => navigate('/', { replace: true })}
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
            onClick={() => navigate('/', { replace: true })}
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
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })
            }}
          >
            <span className='text-xs'>{t('appointmentNumber')}</span>
            <h3 className='text-base text-primary font-bold'>
              {appointmentData.f_appidno}
            </h3>
          </div>
        </div>
      </div>
      <div className='max-w-4xl mx-auto pt-8'>
        <header
          className={`text-center transition-all duration-300 ease-in-out ${
            isButtonFixed ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <h1 className='text-3xl font-bold'>{t('appointmentAddHeadTitle')}</h1>
          <p className='label font-medium mt-3'>{t('appointmentNumber')}</p>
          <h2
            ref={paragraphRef}
            className='mt-1 text-primary text-2xl font-bold'
          >
            {appointmentData.f_appidno}
          </h2>
        </header>

        <div
          className={`card w-full bg-base-100 shadow-xl rounded-[48px] transition-all duration-300 ease-in-out ${
            isButtonFixed ? 'mt-20' : 'mt-8'
          }`}
        >
          <div className='card-body gap-4'>
            <section>
              <h3 className='text-lg font-semibold border-b pb-2 mb-4'>
                {t('detailStatus')}
              </h3>
              <div className='grid grid-cols-1 gap-4'>
                <div>
                  <div className='label'>{t('lastStatus')}</div>
                  <div className='inline-flex items-center font-medium text-base text-primary h-10 w-full'>
                    <IoIosRemove size={32} />
                  </div>
                </div>
                <div>
                  <div className='label'>{t('confirmedBy')}</div>
                  <div className='inline-flex items-center font-medium text-base text-primary h-10 w-full'>
                    <IoIosRemove size={32} />
                  </div>
                </div>
                <div>
                  <div className='label'>{t('queueNumber')}</div>
                  <div className='inline-flex items-center font-medium text-base text-primary h-10 w-full'>
                    <IoIosRemove size={32} />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className='text-lg font-semibold border-b pb-2 mb-4'>
                {t('patientAppointmentInfo')}
              </h3>
              <div className='grid grid-cols-1 gap-4'>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label'>{t('appointmentCreator')}</span>
                  </label>
                  <input
                    type='text'
                    value={appointmentData.f_appcreatebyname}
                    onChange={e =>
                      setAppointmentData({
                        ...appointmentData,
                        f_appcreatebyname: e.target.value
                      })
                    }
                    className='input input-bordered h-13 w-full rounded-3xl'
                  />
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label'>{t('patient')}</span>
                  </label>
                  <input
                    type='text'
                    value={appointmentData.f_appcreateforname}
                    onChange={e =>
                      setAppointmentData({
                        ...appointmentData,
                        f_appcreateforname: e.target.value
                      })
                    }
                    className='input input-bordered h-13 w-full rounded-3xl'
                  />
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label'>HN</span>
                  </label>
                  <input
                    type='text'
                    value={appointmentData.f_appcreateforhn}
                    onChange={e =>
                      setAppointmentData({
                        ...appointmentData,
                        f_appcreateforhn: e.target.value
                      })
                    }
                    className='input input-bordered h-13 w-full rounded-3xl'
                  />
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>
                      {t('scheduledDoctorVisit')}
                    </span>
                  </label>
                  <ThaiDatePicker
                    value={appointmentData.f_appdoctorduedate}
                    onChange={dateString => {
                      setAppointmentData(prev => ({
                        ...prev,
                        f_appdoctorduedate: dateString
                      }))
                    }}
                  />
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label'>{t('contactNumber')} 1</span>
                  </label>
                  <input
                    type='tel'
                    name='f_appcreatecontacttelephone'
                    value={appointmentData.f_appcreatecontacttelephone}
                    onChange={handleInputChange}
                    className='input input-bordered h-13 w-full rounded-3xl'
                  />
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label'>{t('contactNumber')} 2</span>
                  </label>
                  <input
                    type='tel'
                    name='f_appcreatecontacttelephonetwo'
                    value={appointmentData.f_appcreatecontacttelephonetwo}
                    onChange={handleInputChange}
                    className='input input-bordered h-13 w-full rounded-3xl'
                  />
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label'>{t('serviceLocation')}</span>
                  </label>
                  <textarea
                    name='f_appcreatecontactaddress'
                    value={appointmentData.f_appcreatecontactaddress}
                    onChange={handleInputChange}
                    className='textarea textarea-bordered h-24 w-full rounded-3xl'
                  ></textarea>
                </div>
              </div>
            </section>

            <section>
              <h3 className='text-lg font-semibold border-b pb-2 mb-4'>
                {t('mapAndAttachments')}
              </h3>
              <div className='grid grid-cols-1 gap-6 items-start'>
                <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label'>{t('appointmentSlipImage')}</span>
                  </label>
                  <div className='w-full h-52 md:h-84 rounded-3xl mt-3 relative'>
                    <input
                      type='file'
                      accept='image/*'
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className='hidden'
                      id='imageUploader'
                    />

                    {appointmentData.f_apppictureappdoc ? (
                      <div className='w-full h-full'>
                        <img
                          src={appointmentData.f_apppictureappdoc}
                          alt='Preview'
                          className='w-full h-full object-cover rounded-3xl'
                        />
                        <button
                          onClick={handleRemoveImage}
                          className='btn bg-black/30 text-white btn-circle btn-sm border-0 shadow-none absolute top-3 right-3'
                          aria-label='Remove image'
                        >
                          <IoIosClose size={24} />
                        </button>
                      </div>
                    ) : !isImageResizing ? (
                      <label
                        htmlFor='imageUploader'
                        className='w-full h-full md:h-full border-2 border-dashed border-base-content rounded-3xl flex flex-col justify-center items-center cursor-pointer bg-base-200 hover:bg-base-300 transition-colors'
                      >
                        <HiPhoto
                          size={40}
                          className='text-base-content/50 mb-2'
                        />
                        <span className='text-sm text-base-content/70'>
                          {t('uploadImage')}
                        </span>
                      </label>
                    ) : (
                      <div className='w-full h-full md:h-full rounded-3xl flex justify-center items-center bg-base-200'>
                        <span className='loading loading-spinner loading-md'></span>
                      </div>
                    )}
                  </div>
                </div>
                <div className='w-full h-52 md:h-84'>
                  <div
                    className='w-full h-52 md:h-full bg-base-200 rounded-3xl flex items-center justify-center text-base-content/50 overflow-hidden cursor-pointer'
                    onClick={getGeolocation}
                  >
                    {appointmentData.f_appcreatecontactlat &&
                    appointmentData.f_appcreatecontactlon ? (
                      <LocationMap
                        lat={parseFloat(appointmentData.f_appcreatecontactlat)}
                        lon={parseFloat(appointmentData.f_appcreatecontactlon)}
                      />
                    ) : (
                      <div className='w-full h-full md:h-full border-2 border-dashed border-base-content rounded-3xl flex flex-col justify-center items-center cursor-pointer bg-base-200 hover:bg-base-300 transition-colors'>
                        <HiMapPin
                          size={40}
                          className='text-base-content/50 mb-2'
                        />
                        <span className='text-sm text-base-content/70'>
                          {t('getLocation')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <p className='text-xs text-center mt-2 text-base-content/70'>
                  {appointmentData.f_appcreatecontactlat &&
                  appointmentData.f_appcreatecontactlon ? (
                    <>
                      LAT:{' '}
                      {parseFloat(
                        appointmentData.f_appcreatecontactlat
                      ).toFixed(5)}
                      , LON:{' '}
                      {parseFloat(
                        appointmentData.f_appcreatecontactlon
                      ).toFixed(5)}
                    </>
                  ) : (
                    t('noLocation')
                  )}
                </p>
              </div>
              <div className='form-control mt-10'>
                <label
                  className='label cursor-pointer justify-start gap-4'
                  htmlFor='termsAndConditions'
                >
                  <input
                    type='checkbox'
                    id='termsAndConditions'
                    checked={consent}
                    onChange={() => setConsent(!consent)}
                    className='checkbox checkbox-primary'
                  />
                  <span className='label max-w-58 text-wrap'>
                    {t('consent')}
                  </span>
                </label>
              </div>
            </section>

            <div className='card-actions flex-col justify-between border-t pt-6'>
              <button
                disabled={!consent}
                className='btn btn-primary w-full h-13 rounded-3xl text-lg font-bold'
                onClick={handleSubmit}
              >
                {t('saveButton')}
              </button>
              <button
                className='btn w-full h-13 rounded-3xl text-lg font-bold'
                onClick={() => navigate('/', { replace: true })}
              >
                {t('cancelButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentNew
