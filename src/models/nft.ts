export interface NFT {
  meta: NFTMeta
  token_list: NFTToken[]
  holder_address: string
}

export interface NFTMeta {
  current_page: string
  token_count: number
}

export interface NFTToken {
  token_class_name: string
  token_class_image: string
  token_class_description: string
  token_class_total: number
  token_id: number
}

export interface NFTDetail {
  name: string
  description: string
  renderer: string
  issuer_info: {
    name: string
    uuid: string
    avatar_url: string
  }
  total: number
  issued: number
}
