import './index.css'
import 'react-day-picker/dist/style.css'
import Routes from './routes/routes'
import isPropValid from '@emotion/is-prop-valid'
import store from './redux/store'
import i18n from './lang/i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { StyleSheetManager } from 'styled-components'
import { I18nextProvider } from 'react-i18next'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('appWrapper')!).render(
  <StrictMode>
    <StyleSheetManager shouldForwardProp={isPropValid}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <Routes />
          <Toaster position='top-center' reverseOrder={false} />
        </I18nextProvider>
      </Provider>
    </StyleSheetManager>
  </StrictMode>
)
