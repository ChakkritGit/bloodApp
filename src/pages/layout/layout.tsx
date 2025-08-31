import { Outlet } from 'react-router-dom'
import Navbar from '../../components/navbar/navbar'

const Layout = () => {
  return (
    <div className='min-h-dvh flex flex-col bg-base-200'>
      <Navbar />
      <main className='flex-1 flex justify-center p-4 sm:p-6 lg:p-8'>
        <div className='w-full max-w-3xl'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
