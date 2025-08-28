import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { HiPhoto, HiXMark } from 'react-icons/hi2'
import { BiArrowBack } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'

const AppointmentNew = () => {
  const { t } = useTranslation()
  const { id } = useParams()

  const initialFormData = {
    appointmentId: id,
    status: 'รอเข้ารับบริการ',
    confirmer: 'คุณสมชาย ใจดี',
    creator: 'คุณสมหญิง สบายใจ',
    patientInfo: '???????? HN',
    doctorDueDate: '2025-08-25',
    phone1: '089-777-0817',
    phone2: '089-777-0817',
    serviceLocation: '???????????????????????????',
    lat: 13.839735640059327,
    lon: 100.55967513430038
  }

  const [formData, setFormData] = useState(initialFormData)
  const [consent, setConsent] = useState(true)
  const hiddenDateInputRef = useRef<HTMLInputElement>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const [dateValue, setDateValue] = useState('2025-08-25')

  const formattedThaiDate = dateValue
    ? format(new Date(dateValue), 'd MMMM yyyy', { locale: th })
    : 'กรุณาเลือกวันที่'

  const handleDateChange = (e: any) => {
    setDateValue(e.target.value)
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
    if (!selectedFile) {
      setPreviewUrl('')
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  return (
    <div className='min-h-screen bg-base-200 p-4'>
      <button
        className='btn btn-primary h-12 rounded-3xl'
        onClick={() => window.history.back()}
      >
        <BiArrowBack size={24} />
        <span>{t('back')}</span>
      </button>
      <div className='max-w-4xl mx-auto mt-8'>
        <header className='text-center mb-8'>
          <h1 className='text-3xl font-bold'>รายละเอียดใบนัดหมาย</h1>
          <p className='text-base-content/70 font-medium mt-3'>เลขที่ใบนัด</p>
          <h2 className='mt-1 text-primary text-2xl font-bold'>
            {formData.appointmentId}
          </h2>
        </header>

        <div className='card w-full bg-base-100 shadow-xl'>
          <div className='card-body gap-6'>
            <section>
              <h3 className='text-lg font-semibold border-b pb-2 mb-4'>
                ข้อมูลสถานะ
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div>
                  <div className='text-sm text-base-content/70'>
                    สถานะล่าสุด
                  </div>
                  <div className='font-medium'>{formData.status}</div>
                </div>
                <div>
                  <div className='text-sm text-base-content/70'>
                    ผู้ยืนยันนัด
                  </div>
                  <div className='font-medium'>{formData.confirmer}</div>
                </div>
                <div>
                  <div className='text-sm text-base-content/70'>ผู้ทำนัด</div>
                  <div className='font-medium'>{formData.creator}</div>
                </div>
              </div>
            </section>

            <section>
              <h3 className='text-lg font-semibold border-b pb-2 mb-4'>
                ข้อมูลผู้ป่วยและการนัดหมาย
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>ผู้ป่วย</span>
                  </label>
                  <input
                    type='text'
                    value={formData.patientInfo}
                    className='input input-bordered'
                    disabled
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
                    className='input input-bordered w-full cursor-pointer'
                    placeholder='กรุณาเลือกวันที่'
                  />

                  <input
                    type='date'
                    ref={hiddenDateInputRef}
                    value={dateValue}
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
                    name='phone1'
                    value={formData.phone1}
                    onChange={handleInputChange}
                    className='input input-bordered'
                  />
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>เบอร์โทรติดต่อ 2</span>
                  </label>
                  <input
                    type='tel'
                    name='phone2'
                    value={formData.phone2}
                    onChange={handleInputChange}
                    className='input input-bordered'
                  />
                </div>
                <div className='form-control md:col-span-2'>
                  <label className='label'>
                    <span className='label-text'>สถานที่รับบริการ</span>
                  </label>
                  <textarea
                    name='serviceLocation'
                    value={formData.serviceLocation}
                    onChange={handleInputChange}
                    className='textarea textarea-bordered h-24'
                  ></textarea>
                </div>
              </div>
            </section>

            <section>
              <h3 className='text-lg font-semibold border-b pb-2 mb-4'>
                แผนที่และไฟล์แนบ
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-start'>
                <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>ภาพใบนัด</span>
                  </label>
                  <div className='w-full h-48 rounded-lg relative'>
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
                          className='w-full h-full object-cover rounded-lg shadow-md'
                        />
                        <button
                          onClick={handleRemoveImage}
                          className='btn bg-black/15 btn-circle btn-sm border-0 absolute top-2 right-2 shadow-lg'
                          aria-label='Remove image'
                        >
                          <HiXMark size={16} />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor='imageUploader'
                        className='w-full h-full border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer bg-base-200 hover:bg-base-300 transition-colors'
                      >
                        <HiPhoto
                          size={40}
                          className='text-base-content/50 mb-2'
                        />
                        <span className='text-sm text-base-content/70'>
                          คลิกเพื่ออัปโหลดรูปภาพ
                        </span>
                      </label>
                    )}
                  </div>
                </div>
                <div>
                  <div className='w-full h-40 bg-base-200 rounded-lg flex items-center justify-center text-base-content/50'>
                    Map Area
                  </div>
                  <p className='text-xs text-center mt-2 text-base-content/70'>
                    LAT: {formData.lat.toFixed(5)}, LON:{' '}
                    {formData.lon.toFixed(5)}
                  </p>
                </div>
              </div>
              <div className='form-control mt-4'>
                <label className='label cursor-pointer justify-start gap-4'>
                  <input
                    type='checkbox'
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

            <div className='card-actions justify-between border-t pt-6 mt-4'>
              <button className='btn btn-error'>ยกเลิก</button>
              <button className='btn btn-success'>บันทึกข้อมูล</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentNew
