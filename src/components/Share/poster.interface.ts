import { TokenClass } from '../../models/class-list'
import { NFTDetail } from '../../models'

export enum PosterType {
  Nft = 'nft',
  Issuer = 'issuer',
  Account = 'account',
}

export interface NftPosterType {
  type: PosterType.Nft
  data: TokenClass | NFTDetail
}
