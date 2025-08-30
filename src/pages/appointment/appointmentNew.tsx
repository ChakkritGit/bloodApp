import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { HiPhoto } from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'
import { IoIosArrowBack, IoIosClose, IoIosRemove } from 'react-icons/io'
import LocationMap from '../../utils/LocationMap'
import { AxiosError } from 'axios'
import { showToast } from '../../utils/toast'
import { BiError } from 'react-icons/bi'

const AppointmentNew = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [isButtonFixed, setIsButtonFixed] = useState(false)
  const [formData, setFormData] = useState({
    f_appidno: id,
    f_appidgroup: 0,
    f_appidname: '',
    f_appstepno: 0,
    f_appcreatebyname: '',
    f_appcreatedatetime: null,
    f_appcreateforhn: '',
    f_appcreateforname: '',
    f_appcreatefordatetime: null,
    f_appcreateconfirmname: '',
    f_appcreateconfirmdatetime: null,
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
    f_appadminconfirmvisitedate: null,
    f_appcancelname: '',
    f_appcanceldatetime: null,
    f_apppayby: '',
    f_apppaydatetime: null,
    f_apppayprice: 0,
    f_apppictureappdoc: '',
    f_apppictureappdocdatetime: null,
    f_apppicturelisttestdoc: '',
    f_apppicturelisttestdocdatetime: null,
    f_apppicturebloodtube: '',
    f_apppicturebloodtubedatetime: null,
    f_apppictureslipdoc: '',
    f_apppictureslipdocdatetime: null,
    f_apppicturepatient: '',
    f_apppicturepatientdatetime: null,
    f_apppictureuser: '',
    f_apppictureuserdatetime: null,
    f_appadminvisitfullname: '',
    f_appadminvisittelephone: '',
    f_appadminvisitdatetime: null,
    f_apppatientproveinfodatetime: null,
    f_apppatientproveinfostatus: 0,
    f_apppatientproveinfobyname: '',
    f_appcomment: '',
    f_appstatus: 0,
    f_appbastatus: 0,
    f_applastmodified: null
  })
  const [consent, setConsent] = useState(false)
  const hiddenDateInputRef = useRef<HTMLInputElement>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const paragraphRef = useRef<HTMLHeadingElement>(null)

  const handleSubmit = async () => {
    try {
      console.log(formData)
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
    }
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const formattedThaiDate = formData.f_appdoctorduedate
    ? format(new Date(formData.f_appdoctorduedate), 'd MMMM yyyy', {
        locale: th
      })
    : 'กรุณาเลือกวันที่'

  const handleDateChange = (e: any) => {
    setFormData({ ...formData, f_appdoctorduedate: e.target.value })
  }

  const handleVisibleInputClick = () => {
    hiddenDateInputRef.current?.showPicker()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      if (file.type.startsWith('image/')) {
        setSelectedFile(file)
      } else {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น')
        setSelectedFile(null)
      }
    } else {
      setSelectedFile(null)
    }
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setFormData(prev => ({
            ...prev,
            f_appcreatecontactlat: position.coords.latitude.toString(),
            f_appcreatecontactlon: position.coords.longitude.toString()
          }))
        },
        error => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('')
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

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

  return (
    <div className='min-h-screen bg-base-200 p-4'>
      <button
        className={`btn btn-ghost text-primary active:text-primary/50 pr-2 pl-0 h-10 rounded-3xl transition-all ${
          isButtonFixed ? 'invisible' : 'visible'
        }`}
        onClick={() => navigate('/', { replace: true })}
      >
        <IoIosArrowBack size={24} />
        <span>{t('back')}</span>
      </button>
      <div
        className={`fixed left-0 top-0 p-2 w-full rounded-b-3xl bg-base-200/30 backdrop-blur-lg shadow-md z-50 transition-all duration-300 ease-in-out ${
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
              {formData.f_appidno}
            </h3>
          </div>
        </div>
      </div>
      <div className='max-w-4xl mx-auto pt-8'>
        <header className={`text-center transition-all duration-300 ease-in-out ${isButtonFixed ? 'opacity-0' : 'opacity-100'}`}>
          <h1 className='text-3xl font-bold'>{t('appointmentAddHeadTitle')}</h1>
          <p className='text-base-content/70 font-medium mt-3'>
            {t('appointmentNumber')}
          </p>
          <h2
            ref={paragraphRef}
            className='mt-1 text-primary text-2xl font-bold'
          >
            {formData.f_appidno}
          </h2>
        </header>

        <div className={`card w-full bg-base-100 shadow-xl rounded-[48px] transition-all duration-300 ease-in-out ${isButtonFixed ? 'mt-20' : 'mt-8'}`}>
          <div className='card-body gap-6'>
            <section>
              <h3 className='text-lg font-semibold border-b pb-2 mb-4'>
                {t('detailStatus')}
              </h3>
              <div className='grid grid-cols-1 gap-4'>
                <div>
                  <div className='text-sm text-base-content/70'>
                    {t('lastStatus')}
                  </div>
                  <div className='font-medium text-primary'>
                    <IoIosRemove size={24} />
                  </div>
                </div>
                <div>
                  <div className='text-sm text-base-content/70'>
                    {t('confirmedBy')}
                  </div>
                  <div className='font-medium text-primary'>
                    <IoIosRemove size={24} />
                  </div>
                </div>
                <div>
                  <div className='text-sm text-base-content/70'>
                    {t('queueNumber')}
                  </div>
                  <div className='font-medium text-primary'>
                    <IoIosRemove size={24} />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className='text-lg font-semibold border-b pb-2 mb-4'>
                ข้อมูลผู้ป่วยและการนัดหมาย
              </h3>
              <div className='grid grid-cols-1 gap-4'>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>ผู้ทำนัด</span>
                  </label>
                  <input
                    type='text'
                    value={formData.f_appcreatebyname}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        f_appcreatebyname: e.target.value
                      })
                    }
                    className='input input-bordered h-13 w-full rounded-3xl'
                  />
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>ผู้ป่วย</span>
                  </label>
                  <input
                    type='text'
                    value={formData.f_appcreateforname}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        f_appcreateforname: e.target.value
                      })
                    }
                    className='input input-bordered h-13 w-full rounded-3xl'
                  />
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>กำหนดพบแพทย์</span>
                  </label>
                  <input
                    type='text'
                    readOnly
                    value={formattedThaiDate}
                    onClick={handleVisibleInputClick}
                    className='input input-bordered w-full h-13 rounded-3xl cursor-pointer'
                    placeholder='กรุณาเลือกวันที่'
                  />

                  <input
                    type='date'
                    ref={hiddenDateInputRef}
                    value={formData.f_appdoctorduedate}
                    onChange={handleDateChange}
                    className='hidden'
                  />
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>เบอร์โทรติดต่อ 1</span>
                  </label>
                  <input
                    type='tel'
                    name='f_appcreatecontacttelephone'
                    value={formData.f_appcreatecontacttelephone}
                    onChange={handleInputChange}
                    className='input input-bordered h-13 w-full rounded-3xl'
                  />
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>เบอร์โทรติดต่อ 2</span>
                  </label>
                  <input
                    type='tel'
                    name='f_appcreatecontacttelephonetwo'
                    value={formData.f_appcreatecontacttelephonetwo}
                    onChange={handleInputChange}
                    className='input input-bordered h-13 w-full rounded-3xl'
                  />
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>สถานที่รับบริการ</span>
                  </label>
                  <textarea
                    name='f_appcreatecontactaddress'
                    value={formData.f_appcreatecontactaddress}
                    onChange={handleInputChange}
                    className='textarea textarea-bordered h-24 w-full rounded-3xl'
                  ></textarea>
                </div>
              </div>
            </section>

            <section>
              <h3 className='text-lg font-semibold border-b pb-2 mb-4'>
                แผนที่และไฟล์แนบ
              </h3>
              <div className='grid grid-cols-1 gap-6 items-start'>
                <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>ภาพใบนัด</span>
                  </label>
                  <div className='w-full h-52 md:h-84 rounded-3xl relative'>
                    <input
                      type='file'
                      accept='image/*'
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className='hidden'
                      id='imageUploader'
                    />

                    {previewUrl ? (
                      <div className='w-full h-full'>
                        <img
                          src={previewUrl}
                          alt='Preview'
                          className='w-full h-full object-cover rounded-3xl'
                        />
                        <button
                          onClick={handleRemoveImage}
                          className='btn bg-black/15 btn-circle btn-sm border-0 absolute top-3 right-3'
                          aria-label='Remove image'
                        >
                          <IoIosClose size={24} />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor='imageUploader'
                        className='w-full h-full md:h-full border-2 border-dashed rounded-3xl flex flex-col justify-center items-center cursor-pointer bg-base-200 hover:bg-base-300 transition-colors'
                      >
                        <HiPhoto
                          size={40}
                          className='text-base-content/50 mb-2'
                        />
                        <span className='text-sm text-base-content/70'>
                          แตะเพื่ออัปโหลดรูปภาพ
                        </span>
                      </label>
                    )}
                  </div>
                </div>
                <div className='w-full h-52 md:h-84'>
                  <div className='w-full h-52 md:h-full bg-base-200 rounded-3xl flex items-center justify-center text-base-content/50 overflow-hidden'>
                    <LocationMap
                      lat={parseFloat(formData.f_appcreatecontactlat)}
                      lon={parseFloat(formData.f_appcreatecontactlon)}
                    />
                  </div>
                  <p className='text-xs text-center mt-2 text-base-content/70'>
                    LAT: {parseFloat(formData.f_appcreatecontactlat).toFixed(5)}
                    , LON:{' '}
                    {parseFloat(formData.f_appcreatecontactlon).toFixed(5)}
                  </p>
                </div>
              </div>
              <div className='form-control mt-4'>
                <label
                  className='label cursor-pointer justify-start gap-4'
                  htmlFor='termsAndConditions'
                >
                  <input
                    type='checkbox'
                    id='termsAndConditions'
                    checked={consent}
                    onChange={() => setConsent(!consent)}
                    className='checkbox'
                  />
                  <span className='label-text'>
                    ยินยอมให้โรงพยาบาลใช้งานข้อมูลส่วนบุคคลนี้
                  </span>
                </label>
              </div>
            </section>

            <div className='card-actions flex-col justify-between border-t pt-6 mt-4'>
              <button
                disabled={!consent}
                className='btn btn-primary w-full h-13 rounded-3xl text-lg font-bold'
                onClick={handleSubmit}
              >
                บันทึกข้อมูล
              </button>
              <button
                className='btn w-full h-13 rounded-3xl text-lg font-bold'
                onClick={() => navigate('/', { replace: true })}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>

        {/* <div className='form-control mt-8'>
          <label
            className='label cursor-pointer justify-start gap-4'
            htmlFor='termsAndConditions'
          >
            <input
              type='checkbox'
              id='termsAndConditions'
              checked={consent}
              onChange={() => setConsent(!consent)}
              className='checkbox'
            />
            <span className='label-text'>
              ยินยอมให้โรงพยาบาลใช้งานข้อมูลส่วนบุคคลนี้
            </span>
          </label>
        </div>

        <div className='card-actions flex-col justify-between  mt-4'>
          <button
            disabled={!consent}
            className='btn btn-primary w-full h-13 rounded-3xl text-lg font-bold'
          >
            บันทึกข้อมูล
          </button>
          <button
            className='btn w-full h-13 rounded-3xl text-lg font-bold'
            onClick={() => navigate('/', { replace: true })}
          >
            ยกเลิก
          </button>
        </div> */}
      </div>
    </div>
  )
}

export default AppointmentNew
