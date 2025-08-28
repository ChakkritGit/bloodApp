import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'
import { CookieDecode } from '../../pages/types/cookie.type'
import { TokenDecode } from '../types/token.type'
import {
  COOKIE_ENCODE,
  COOKIE_DECODE,
  TOKEN_DECODE,
  RESET_UTILS,
  CURRENT_LANG,
} from '../types/utilsTypes'

const setCookieEncode = (dataEncode?: string) => ({
  type: COOKIE_ENCODE,
  payload: dataEncode
})

const setCookieDecode = (dataDecode?: CookieDecode) => ({
  type: COOKIE_DECODE,
  payload: dataDecode
})

const setTokenDecode = (tokenDecode: TokenDecode) => ({
  type: TOKEN_DECODE,
  payload: tokenDecode
})

const setLanguage = (lang: string) => {
  cookies.set('lang', lang, cookieOptions)

  return {
    type: CURRENT_LANG,
    payload: lang
  }
}

const resetUtils = () => ({
  type: RESET_UTILS
})

export {
  setCookieEncode,
  setCookieDecode,
  setTokenDecode,
  resetUtils,
  setLanguage
}
