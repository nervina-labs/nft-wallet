import { VipInfo } from './class-list'

export interface SpecialAssetsToken extends VipInfo {
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
  bg_color: string
  token_classes: SpecialAssetsToken[]
}
