import axios, { AxiosError } from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { showToast } from '../../utils/toast'
import { BiError } from 'react-icons/bi'
import { ApiResponse } from '../../types/api.response.type'
import { Appointment } from '../../types/appointment.type'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { IoIosArrowBack, IoIosRemove } from 'react-icons/io'
import { HiMapPin, HiMiniXMark, HiPhoto } from 'react-icons/hi2'
import LocationMap from '../../utils/LocationMap'
import { delay } from '../../constants/utils/utilsConstants'

const AppointmentSearch = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [isButtonFixed, setIsButtonFixed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [openImage, setOpnemImage] = useState('')
  const [appointmentData, setAppointmentData] = useState<Appointment>({
    f_appidno: '',
    f_appidgroup: 0,
    f_appidname: '',
    f_appstepno: 0,
    f_appcreatebyname: '',
    f_appcreatedatetime: '',
    f_appcreateforhn: '',
    f_appcreateforname: '',
    f_appcreatefordatetime: '',
    f_appcreateconfirmname: '',
    f_appcreateconfirmdatetime: '',
    f_appcreatecontacttelephone: '',
    f_appcreatecontacttelephonetwo: '',
    f_appcreatecontactaddress: '',
    f_appcreatecontactlat: '',
    f_appcreatecontactlon: '',
    f_appcreatecontactacc: '',
    f_appdoctorduedate: '',
    f_appadminduedate: '',
    f_appadmindueque: 0,
    f_appadminduequemax: 0,
    f_appadminconfirmdate: '',
    f_appadminconfirmtime: '',
    f_appadminconfirmque: 0,
    f_appadminconfirmvisitedate: '',
    f_appcancelname: '',
    f_appcanceldatetime: '',
    f_apppayby: '',
    f_apppaydatetime: '',
    f_apppayprice: '0',
    f_apppictureappdoc: '',
    f_apppictureappdocdatetime: '',
    f_apppicturelisttestdoc: '',
    f_apppicturelisttestdocdatetime: '',
    f_apppicturebloodtube: '',
    f_apppicturebloodtubedatetime: '',
    f_apppictureslipdoc: '',
    f_apppictureslipdocdatetime: '',
    f_apppicturepatient: '',
    f_apppicturepatientdatetime: '',
    f_apppictureuser: '',
    f_apppictureuserdatetime: '',
    f_appadminvisitfullname: '',
    f_appadminvisittelephone: '',
    f_appadminvisitdatetime: '',
    f_apppatientproveinfodatetime: '',
    f_apppatientproveinfostatus: '',
    f_apppatientproveinfobyname: '',
    f_appcomment: '',
    f_appstatus: '',
    f_appbastatus: '',
    f_applastmodified: '',
    files: {
      appointment: null,
      slip: null,
      testListDocs: [],
      bloodTubes: [],
      others: []
    }
  })
  const paragraphRef = useRef<HTMLHeadingElement>(null)
  const openImageRef = useRef<HTMLDialogElement>(null)

  const [zoom, setZoom] = useState(false)

  const formattedThaiDate = appointmentData.f_appdoctorduedate
    ? format(new Date(appointmentData.f_appdoctorduedate), 'd MMMM yyyy', {
        locale: th
      })
    : t('selectDate')

  const formattedThaiServiceDate = appointmentData.f_appadminduedate ? (
    format(new Date(appointmentData.f_appadminduedate), 'd MMMM yyyy', {
      locale: th
    })
  ) : (
    <div className='font-medium text-primary'>
      <IoIosRemove size={32} />
    </div>
  )

  const statusMap: Record<number, string> = {
    1: t('stepAppOne'),
    2: t('stepAppTwo'),
    3: t('stepAppThree'),
    4: t('stepAppFour')
  }

  const fetchAppointment = async () => {
    setIsLoading(true)
    try {
      const result = await axios.get<ApiResponse<Appointment>>(
        `${import.meta.env.VITE_APP_API}/appointment/search/${id}`
      )

      setAppointmentData(result.data.data)
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
    if (!id || id === undefined) return
    fetchAppointment()
  }, [id])

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

  // useEffect(() => {
  //   if (openImageRef.current && openImageRef.current.open) {
  //     setOpnemImage('')
  //   }
  // }, [])

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
      {!isLoading ? (
        <>
          <div
            className={`fixed left-0 top-0 p-2 w-full rounded-b-3xl bg-base-100/60 backdrop-blur-xl shadow-md z-50 select-none transition-all duration-300 ease-in-out ${
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
              <h1 className='text-3xl font-bold'>
                {t('appointmentViewHeadTitle')}
              </h1>
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
                        {statusMap[appointmentData.f_appstepno] ??
                          t('stepAppFri')}
                      </div>
                    </div>
                    <div>
                      <div className='label'>{t('confirmedBy')}</div>
                      <div className='inline-flex items-center font-medium text-base text-primary h-10 w-full'>
                        {appointmentData.f_appcreateconfirmname ? (
                          <div className='flex flex-col'>
                            <span>
                              {appointmentData.f_appcreateconfirmname}
                            </span>
                            <span className='text-sm'>
                              {appointmentData.f_appcreateconfirmdatetime
                                ? format(
                                    new Date(
                                      appointmentData.f_appcreateconfirmdatetime
                                    ),
                                    'd MMMM yyyy',
                                    {
                                      locale: th
                                    }
                                  )
                                : '—'}
                            </span>
                          </div>
                        ) : (
                          <IoIosRemove size={32} />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className='label'>{t('queueNumber')}</div>
                      <div className='inline-flex items-center font-medium text-base text-primary h-10 w-full'>
                        {appointmentData.f_appadminduequemax ? (
                          `${appointmentData.f_appadminduequemax} / 30`
                        ) : (
                          <IoIosRemove size={32} />
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className='text-lg font-semibold border-b pb-2 mb-4'>
                    {t('patientAppointmentInfo')}
                  </h3>
                  <div className='grid grid-cols-1 gap-3'>
                    <div className='form-control'>
                      <label className='label'>
                        <span className='label'>{t('appointmentCreator')}</span>
                      </label>
                      <span className='inline-flex items-center font-medium text-base h-10 w-full'>
                        {appointmentData.f_appcreatebyname}
                      </span>
                    </div>
                    <div className='form-control'>
                      <label className='label'>
                        <span className='label'>{t('patient')}</span>
                      </label>
                      <div className='inline-flex items-center font-medium text-base h-10 w-full'>
                        {appointmentData.f_appcreateforname}
                      </div>
                    </div>
                    <div className='form-control'>
                      <label className='label'>
                        <span className='label'>HN</span>
                      </label>
                      <div className='inline-flex items-center font-medium text-base h-10 w-full'>
                        {appointmentData.f_appcreateforhn}
                      </div>
                    </div>
                    <div className='form-control'>
                      <label className='label'>
                        <span className='label'>
                          {t('scheduledDoctorVisit')}
                        </span>
                      </label>
                      <div className='inline-flex items-center font-medium text-base h-10 w-full'>
                        {formattedThaiDate}
                      </div>
                    </div>
                    <div className='form-control'>
                      <label className='label'>
                        <span className='label'>{t('serviceDate')}</span>
                      </label>
                      <div className='inline-flex items-center font-medium text-base h-10 w-full'>
                        {formattedThaiServiceDate}
                      </div>
                    </div>
                    <div className='form-control'>
                      <label className='label'>
                        <span className='label'>{t('contactNumber')} 1</span>
                      </label>
                      <div className='inline-flex items-center font-medium text-base h-10 w-full'>
                        {appointmentData.f_appcreatecontacttelephone}
                      </div>
                    </div>
                    <div className='form-control'>
                      <label className='label'>
                        <span className='label'>{t('contactNumber')} 2</span>
                      </label>
                      <div className='inline-flex items-center font-medium text-base h-10 w-full'>
                        {appointmentData.f_appcreatecontacttelephonetwo}
                      </div>
                    </div>
                    <div className='form-control'>
                      <label className='label'>
                        <span className='label'>{t('serviceLocation')}</span>
                      </label>
                      <div className='inline-flex items-center font-medium text-base h-10 w-full'>
                        {appointmentData.f_appcreatecontactaddress}
                      </div>
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
                        <span className='label'>
                          {t('appointmentSlipImage')}
                        </span>
                      </label>
                      <div className='w-full h-52 md:h-84 rounded-3xl mt-3 relative'>
                        {appointmentData.files?.appointment
                          ?.f_appimageidpart ? (
                          <div
                            className='w-full h-full cursor-pointer hover:opacity-90 transition-opacity duration-300 ease-in-out'
                            onClick={() => {
                              setOpnemImage(
                                import.meta.env.VITE_APP_IMG +
                                  appointmentData.files?.appointment
                                    ?.f_appimageidpart
                              )
                              openImageRef.current?.showModal()
                            }}
                          >
                            <img
                              src={
                                import.meta.env.VITE_APP_IMG +
                                appointmentData.files.appointment
                                  .f_appimageidpart
                              }
                              alt='Preview'
                              className='w-full h-full object-cover rounded-3xl'
                            />
                          </div>
                        ) : (
                          <label className='w-full h-full md:h-full rounded-3xl flex flex-col justify-center items-center cursor-pointer bg-base-200 hover:bg-base-300 transition-colors'>
                            <HiPhoto
                              size={40}
                              className='text-base-content/50 mb-2'
                            />
                          </label>
                        )}
                      </div>

                      <label className='label mt-3'>
                        <span className='label'>{t('testListImage')}</span>
                      </label>

                      <div className='w-full h-52 md:h-84 mt-3 relative'>
                        {appointmentData.files?.testListDocs.length > 0 ? (
                          <div className='flex gap-3 overflow-x-auto h-full pr-10 rounded-3xl'>
                            {appointmentData.files?.testListDocs.map(
                              (img, index) => (
                                <div
                                  key={index}
                                  className='flex-shrink-0 w-52 h-full rounded-3xl cursor-pointer hover:opacity-90 transition-opacity duration-300 ease-in-out'
                                  onClick={() => {
                                    setOpnemImage(
                                      import.meta.env.VITE_APP_IMG +
                                        img.f_appimageidpart
                                    )
                                    openImageRef.current?.showModal()
                                  }}
                                >
                                  <img
                                    src={
                                      import.meta.env.VITE_APP_IMG +
                                      img.f_appimageidpart
                                    }
                                    alt='Preview'
                                    className='w-full h-full object-cover rounded-3xl'
                                  />
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <label className='w-full h-full md:h-full rounded-3xl flex flex-col justify-center items-center cursor-pointer bg-base-200 hover:bg-base-300 transition-colors'>
                            <HiPhoto
                              size={40}
                              className='text-base-content/50 mb-2'
                            />
                          </label>
                        )}
                      </div>

                      <label className='label mt-3'>
                        <span className='label'>{t('bloodTubsImage')}</span>
                      </label>

                      <div className='w-full h-52 md:h-84 mt-3 relative'>
                        {appointmentData.files?.bloodTubes.length > 0 ? (
                          <div className='flex gap-3 overflow-x-auto h-full pr-10 rounded-3xl'>
                            {appointmentData.files?.bloodTubes.map(
                              (img, index) => (
                                <div
                                  key={index}
                                  className='flex-shrink-0 w-52 h-full rounded-3xl cursor-pointer hover:opacity-90 transition-opacity duration-300 ease-in-out'
                                  onClick={() => {
                                    setOpnemImage(
                                      import.meta.env.VITE_APP_IMG +
                                        img.f_appimageidpart
                                    )
                                    openImageRef.current?.showModal()
                                  }}
                                >
                                  <img
                                    src={
                                      import.meta.env.VITE_APP_IMG +
                                      img.f_appimageidpart
                                    }
                                    alt='Preview'
                                    className='w-full h-full object-cover rounded-3xl'
                                  />
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <label className='w-full h-full md:h-full rounded-3xl flex flex-col justify-center items-center cursor-pointer bg-base-200 hover:bg-base-300 transition-colors'>
                            <HiPhoto
                              size={40}
                              className='text-base-content/50 mb-2'
                            />
                          </label>
                        )}
                      </div>

                      <label className='label'>
                        <span className='label mt-3'>
                          {t('paymentSlipImage')}
                        </span>
                      </label>

                      <div className='w-full h-52 md:h-84 rounded-3xl mt-3 relative'>
                        {appointmentData.files?.slip?.f_appimageidpart ? (
                          <div
                            className='w-full h-full cursor-pointer hover:opacity-90 transition-opacity duration-300 ease-in-out'
                            onClick={() => {
                              setOpnemImage(
                                import.meta.env.VITE_APP_IMG +
                                  appointmentData.files?.appointment
                                    ?.f_appimageidpart
                              )
                              openImageRef.current?.showModal()
                            }}
                          >
                            <img
                              src={
                                import.meta.env.VITE_APP_IMG +
                                appointmentData.files.slip.f_appimageidpart
                              }
                              alt='Preview'
                              className='w-full h-full object-cover rounded-3xl'
                            />
                          </div>
                        ) : (
                          <label className='w-full h-full md:h-full rounded-3xl flex flex-col justify-center items-center cursor-pointer bg-base-200 hover:bg-base-300 transition-colors'>
                            <HiPhoto
                              size={40}
                              className='text-base-content/50 mb-2'
                            />
                          </label>
                        )}
                      </div>
                    </div>
                    <div className='w-full h-52 md:h-84'>
                      <div className='w-full h-52 md:h-full bg-base-200 rounded-3xl flex items-center justify-center text-base-content/50 overflow-hidden cursor-pointer'>
                        {appointmentData.f_appcreatecontactlat &&
                        appointmentData.f_appcreatecontactlon ? (
                          <LocationMap
                            lat={parseFloat(
                              appointmentData.f_appcreatecontactlat
                            )}
                            lon={parseFloat(
                              appointmentData.f_appcreatecontactlon
                            )}
                          />
                        ) : (
                          <div className='w-full h-full md:h-full border-2 border-dashed rounded-3xl flex flex-col justify-center items-center cursor-pointer bg-base-200 hover:bg-base-300 transition-colors'>
                            <HiMapPin
                              size={40}
                              className='text-base-content/50 mb-2'
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <p className='text-xs text-center mt-2 text-base-content/70 mb-3'>
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
                </section>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='flex items-center justify-center'>
          <span className='loading loading-spinner loading-md'></span>
        </div>
      )}

      <dialog
        ref={openImageRef}
        className='modal'
        onClose={async () => {
          await delay(300)
          setOpnemImage('')
          setZoom(false)
        }}
      >
        <div className='modal-box rounded-[48px]'>
          <form method='dialog'>
            <button className='btn btn-sm bg-base-200 text-base-content/90 btn-circle btn-ghost absolute right-7 top-5'>
              <HiMiniXMark size={32} />
            </button>
          </form>
          <div className='mt-12 max-h-[70vh] overflow-auto flex justify-center'>
            <img
              src={openImage}
              alt='Preview'
              onClick={() => setZoom(!zoom)}
              className={`rounded-3xl transition-transform duration-300 cursor-zoom-in ${
                zoom ? 'scale-200 cursor-zoom-out' : 'scale-100'
              }`}
            />
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default AppointmentSearch
