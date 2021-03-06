import { VipInfo } from './class-list'
import { Follower } from './issuer'
import { CardBack, NftType } from './nft'

export interface SpecialAssetsToken extends VipInfo, CardBack {
  bg_image_url: string
  issuer_info: {
    name: string
    uuid: string
    avatar_url: string
  } & Follower
  name: string
  uuid: string
  renderer_type: NftType
  renderer: string
}

export interface SpecialAssets {
  name: string
  locales: {
    [key: string]: string
  }
  uuid: string
  bg_color: string
  token_classes: SpecialAssetsToken[]
}
