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
  token_class_image: string
  token_class_uuid: string
  token_class_description: string
  token_class_total: number
  token_uuid: string
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
