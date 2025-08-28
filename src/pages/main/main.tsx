import { useState } from 'react'
import { Link } from 'react-router-dom'

const Main = () => {
  const [appointmentId, setAppointmentId] = useState('')

  const handleSearch = () => {
    alert(`กำลังค้นหาเลขที่ใบนัด: ${appointmentId}`)
  }

  return (
    <div data-theme='lofi' className='min-h-screen bg-base-200 font-sans'>
      {/* ส่วน Header */}
      <header className='p-4 max-w-4xl mx-auto'>
        <div className='flex justify-between items-center text-base-content/70'>
          <h1 className='text-xl md:text-2xl font-bold text-center text-base-content'>
            ระบบนัดหมายเจาะเลือดนอกสถานที่
          </h1>
        </div>
        <div className='divider mt-2'></div>
      </header>

      {/* ส่วน Content หลัก */}
      <main className='flex justify-center items-start pt-12 md:pt-20 px-4'>
        <div className='card w-full max-w-sm bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl'>
          <div className='card-body'>
            <h2 className='card-title justify-center text-2xl mb-6'>
              ค้นหาใบนัดหมาย
            </h2>

            {/* Form สำหรับกรอกข้อมูล */}
            <div className='form-control w-full'>
              <label className='label'>
                <span className='label-text'>กรุณากรอกเลขที่ใบนัด</span>
              </label>
              <input
                type='text'
                placeholder='ตัวอย่าง: APN6708001'
                className='input input-bordered w-full'
                value={appointmentId}
                onChange={e => setAppointmentId(e.target.value)}
              />
            </div>

            <div className='card-actions mt-6'>
              <button className='btn btn-primary w-full' onClick={handleSearch}>
                ค้นหา
              </button>
            </div>

            {/* ลิงก์สำหรับเจ้าหน้าที่ */}
            <div className='text-center mt-4'>
              <Link
                to='/appointment'
                className='link link-hover text-sm text-base-content/70'
              >
                สำหรับเจ้าหน้าที่
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Main
