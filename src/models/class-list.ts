import { ListMeta } from './nft'

export interface Tag {
  uuid: string
  name: string
}

export interface TokenClass {
  bg_image_url: string
  name: string
  description: string
  issued: string
  is_issuer_banned: boolean
  is_class_banned: boolean
  uuid: string
  issuer_info: {
    name: string
    avatar_url: string
    uuid: string
  }
  total: string
  tags: Tag[]
}

export interface ClassList {
  class_list: TokenClass[]
  meta: ListMeta
}
