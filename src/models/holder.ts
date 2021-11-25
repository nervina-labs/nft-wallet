import { ListMeta } from './nft'
import { AvatarType } from './user'

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
    avatar_tid?: number | null
    avatar_type: AvatarType
  }
}
