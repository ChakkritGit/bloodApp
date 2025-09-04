import { createBrowserRouter } from 'react-router-dom'
import { AuthRoute } from './middlewares/authprotect'
import { LogoutAuth } from './middlewares/authLogin'
import ErrorPage from './pages/errorPage'
import NotFound from './pages/notFound'
import Main from '../pages/main/main'
import AppointmentNew from '../pages/appointment/appointmentNew'
import AppointmentSearch from '../pages/appointment/appointmentSearch'
import Layout from '../pages/layout/layout'
import Home from '../pages/home/home'
import User from '../pages/user/user'
// import Setting from '../pages/setting/setting'
import AppointmentConfirm from '../pages/appointment/appointmentConfirm'
import Register from '../pages/user/register'

const router = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <Main />,
      errorElement: <ErrorPage />
    },
    {
      path: '/appointment/search/:id',
      element: <AppointmentSearch />,
      errorElement: <ErrorPage />
    },
    {
      path: '/appointment/new/:id',
      element: <AppointmentNew />,
      errorElement: <ErrorPage />
    },
    {
      path: '/appointment',
      element: <AuthRoute />,
      children: [
        {
          path: '/appointment',
          element: <Layout />,
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: <Home />,
              errorElement: <ErrorPage />
            },
            {
              path: '/appointment/user',
              element:  <User />,
              errorElement: <ErrorPage />
            },
            {
              path: '/appointment/user/register',
              element:  <Register />,
              errorElement: <ErrorPage />
            },
            // {
            //   path: '/appointment/setting',
            //   element: <Setting />,
            //   errorElement: <ErrorPage />
            // },
            {
              path: '/appointment/confirm/:id',
              element: <AppointmentConfirm />,
              errorElement: <ErrorPage />
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      element: <LogoutAuth />,
      errorElement: <ErrorPage />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])

export { router }
