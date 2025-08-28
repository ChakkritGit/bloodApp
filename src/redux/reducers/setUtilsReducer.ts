import { cookies } from '../../constants/utils/utilsConstants'
import {
  COOKIE_ENCODE,
  COOKIE_DECODE,
  TOKEN_DECODE,
  UtilsState,
  UtilsAction,
  RESET_UTILS,
  CURRENT_LANG
} from '../types/utilsTypes'

const initialState: UtilsState = {
  cookieEncode: cookies.get('tokenObject'),
  cookieDecode: undefined,
  tokenDecode: undefined,
  currentLang: cookies.get('lang') ?? 'th'
}

const utilsReducer = (
  state = initialState,
  action: UtilsAction
): UtilsState => {
  switch (action.type) {
    case COOKIE_ENCODE:
      return { ...state, cookieEncode: action.payload }
    case COOKIE_DECODE:
      return { ...state, cookieDecode: action.payload }
    case TOKEN_DECODE:
      return { ...state, tokenDecode: action.payload }
    case CURRENT_LANG:
      return { ...state, currentLang: action.payload }
    case RESET_UTILS:
      return initialState
    default:
      return state
  }
}

export default utilsReducer
