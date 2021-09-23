export enum AvatarType {
  Token = 'token',
  Image = 'image',
}

export interface User {
  email: string
  mobile_phone: string
  nickname: string
  gender: string
  birthday: string
  description: string
  region: string
  avatar: string
  avatar_type: AvatarType
  avatar_token_uuid: string
  guide_finished: string
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
  avatar_type: AvatarType
  avatar_token_uuid?: string
  nickname: string
  gender: string
  birthday: string
  region: string
  guide_finished: boolean
  description: string
  avatar_tid?: number
}
