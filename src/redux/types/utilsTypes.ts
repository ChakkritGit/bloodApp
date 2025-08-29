import { CookieDecode } from "../../pages/types/cookie.type"
import { TokenDecode } from "../../types/token.type"

const COOKIE_ENCODE = 'COOKIE_ENCODE'
const COOKIE_DECODE = 'COOKIE_DECODE'
const TOKEN_DECODE = 'TOKEN_DECODE'
const RESET_UTILS = 'RESET_UTILS'
const CURRENT_LANG = 'CURRENT_LANG'

interface UtilsState {
  cookieEncode?: string
  cookieDecode?: CookieDecode
  tokenDecode?: TokenDecode
  currentLang: string
}

type UtilsAction =
  | { type: typeof COOKIE_ENCODE; payload: string }
  | { type: typeof COOKIE_DECODE; payload: CookieDecode }
  | { type: typeof TOKEN_DECODE; payload: TokenDecode }
  | { type: typeof RESET_UTILS }
  | { type: typeof CURRENT_LANG; payload: string }

export {
  COOKIE_ENCODE,
  COOKIE_DECODE,
  TOKEN_DECODE,
  RESET_UTILS,
  CURRENT_LANG
}
export type { UtilsState, UtilsAction }
