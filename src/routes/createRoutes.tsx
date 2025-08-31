import { createBrowserRouter } from 'react-router-dom'
import { AuthRoute } from './middlewares/authprotect'
import { LogoutAuth } from './middlewares/authLogin'
import ErrorPage from './pages/errorPage'
import NotFound from './pages/notFound'
import Main from '../pages/main/main'
import AppointmentNew from '../pages/appointment/appointmentNew'
import AppointmentSearch from '../pages/appointment/appointmentSearch'
import Layout from '../pages/layout/layout'

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
              element: <div>Home</div>,
              errorElement: <ErrorPage />
            },
            {
              path: '/appointment/user',
              element: <div>User</div>,
              errorElement: <ErrorPage />
            },
            {
              path: '/appointment/setting',
              element: <div>Setting</div>,
              errorElement: <ErrorPage />
            },
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
