type LoginResponse = {
  token: string
  f_id: string
  f_userfullname: string
  f_userstatus: number
}

type UserRegister = {
  f_id: string
  f_username: string
  f_userfullname: string
  f_userstatus: number | null
}

export type { LoginResponse, UserRegister }
