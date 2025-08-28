import { createBrowserRouter } from 'react-router-dom'
import { AuthRoute } from './middlewares/authprotect'
import { LogoutAuth } from './middlewares/authLogin'
import ErrorPage from './pages/errorPage'
import NotFound from './pages/notFound'
import Main from '../pages/main/main'

const router = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <Main />,
      errorElement: <ErrorPage />
    },
    {
      path: '/appointment/search',
      element: <Main />,
      errorElement: <ErrorPage />
    },
    {
      path: '/appointment',
      element: <AuthRoute />,
      children: [
        {
          path: '/appointment',
          element: <div>Layout</div>,
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: <div>Home</div>,
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
