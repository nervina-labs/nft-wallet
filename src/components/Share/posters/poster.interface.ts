import { TokenClass } from '../../../models/class-list'
import { NFTDetail, NFTToken } from '../../../models'
import { IssuerInfoResult, IssuerTokenClass } from '../../../models/issuer'
import { UserResponse } from '../../../models/user'

export enum PosterType {
  Nft = 'nft',
  Issuer = 'issuer',
  Holder = 'holder',
}

export interface PosterDataBase<T> {
  type: PosterType
  data: T
}

export interface NftPosterData extends PosterDataBase<TokenClass | NFTDetail> {
  type: PosterType.Nft
}

export interface IssuerPosterData
  extends PosterDataBase<{
    issuerInfo: IssuerInfoResult
    tokenClasses: IssuerTokenClass[]
  }> {
  type: PosterType.Issuer
}

export interface HolderPosterData
  extends PosterDataBase<{
    userInfo: UserResponse
    tokens: NFTToken[]
    tokenLength: number
  }> {
  type: PosterType.Holder
}

export type Poster = NftPosterData | IssuerPosterData | HolderPosterData

export type PosterProps<T extends Poster> = Pick<T, 'data'> & {
  onLoad: (el: HTMLDivElement) => void
  shareUrl?: string
}
