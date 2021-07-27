import { VipInfo } from './class-list'

export interface Issuer extends VipInfo {
  bg_image_url: string
  avatar_url: string
  name: string
  description: string
  uuid: string
  issuer_likes: string
}
