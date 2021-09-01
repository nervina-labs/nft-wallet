import { ListMeta } from './nft'

export interface GetHolderByTokenClassUuidResponse {
  token_holder_list: TokenClassUuidHolder[]
  meta: ListMeta
}

export interface TokenClassUuidHolder {
  n_token_id: number
  holder_info: {
    address: string
    nickname: string
    avatar_url: string
  }
}
