import { createBrowserRouter } from 'react-router-dom'
import { AuthRoute } from './middlewares/authprotect'
import { LogoutAuth } from './middlewares/authLogin'
import ErrorPage from './pages/errorPage'
import NotFound from './pages/notFound'
import Test from '../pages/test'

const router = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <Test />,
      errorElement: <ErrorPage />
    },
    {
      path: '/manage',
      element: <AuthRoute />,
      children: [
        {
          path: '/manage',
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
