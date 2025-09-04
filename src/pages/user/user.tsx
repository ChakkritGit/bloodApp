import { ReactNode, useEffect, useState } from 'react'
import { UserType } from '../../types/user.type'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '../../types/api.response.type'
import { useTranslation } from 'react-i18next'
import UserPagination from '../../components/pagination/user.pagination'
import { useNavigate } from 'react-router-dom'

const User = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [userData, UserType] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchUser = async () => {
    setIsLoading(true)
    try {
      const user = await axios.get<ApiResponse<UserType[]>>(
        `${import.meta.env.VITE_APP_API}/auth/user`
      )
      UserType(user.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const renderUserCard = (user: UserType): ReactNode => {
    return (
      <div
        key={user.f_id}
        className={`card w-full p-5 max-w-sm bg-base-100 rounded-4xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
      >
        <div>
          <h1 className='text-xl font-bold truncate max-w-[330px]'>
            {t('fullName')}: {user.f_userfullname}
          </h1>
          <span>{user.f_username}</span>
        </div>
      </div>
    )
  }

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div>
      {isLoading ? (
        <div className='flex items-center justify-center'>
          <span className='loading loading-spinner text-base-content loading-md'></span>
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          <div className='flex items-center justify-end'>
            <button
              className='btn btn-primary h-13 rounded-3xl'
              onClick={() => navigate('/appointment/user/register')}
            >
              {t('createNewAccount')}
            </button>
          </div>

          <UserPagination
            data={userData}
            initialPerPage={10}
            itemPerPage={[10, 50, 100]}
            renderItem={renderUserCard}
          />
        </div>
      )}
    </div>
  )
}

export default User
