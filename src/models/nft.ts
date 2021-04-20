export interface NFT {
  meta: ListMeta
  token_list: NFTToken[]
  holder_address: string
}

export interface ListMeta {
  current_page: number
  total_count: number
}

export interface NFTToken {
  token_class_name: string
  token_class_bg_url: string
  token_class_uuid: string
  token_class_description: string
  token_class_total: number
  token_uuid: string
  issuer_avatar_url: string
  issuer_name: string
}

export interface NFTDetail {
  name: string
  description: string
  bg_image_url: string
  issuer_info: {
    name: string
    uuid: string
    avatar_url: string
  }
  total: number
  issued: number
  is_submitting: boolean
}
