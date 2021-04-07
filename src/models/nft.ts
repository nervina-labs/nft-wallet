export interface NFT {
  holder_info: HolderInfo
  token_list: NFTToken[]
}

export interface HolderInfo {
  address: string
  token_count: number
}

export interface NFTToken {
  token_class_name: string
  token_class_image: string
  token_class_description: string
  token_class_total: number
  token_id: number
}
