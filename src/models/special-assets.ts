import { VipInfo } from './class-list'
import { CardBack } from './nft'

export interface SpecialAssetsToken extends VipInfo, CardBack {
  bg_image_url: string
  issuer_name: string
  name: string
  uuid: string
  renderer_type: string
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
