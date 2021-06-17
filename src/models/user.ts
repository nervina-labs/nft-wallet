export interface User {
  email: string
  mobile_phone: string
  nickname: string
  gender: string
  birthday: string
  description: string
  region: string
  avatar: string
}

export interface Auth {
  address: string
  message: string
  signature: string
}

export interface Profile {
  user: Partial<User>
  auth: Auth
}

export interface UserResponse {
  avatar_url: string
  nickname: string
  gender: string
  birthday: string
  region: string
  description: string
}
