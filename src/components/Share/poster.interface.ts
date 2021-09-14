import { TokenClass } from '../../models/class-list'
import { NFTDetail, NFTToken } from '../../models'
import { IssuerInfoResult, IssuerTokenClass } from '../../models/issuer'
import { UserResponse } from '../../models/user'

export enum PosterType {
  Nft = 'nft',
  Issuer = 'issuer',
  Holder = 'holder',
}

export interface PosterDataBase {
  type: PosterType
  data: any
}

export interface NftPosterData extends PosterDataBase {
  type: PosterType.Nft
  data: TokenClass | NFTDetail
}

export interface IssuerPosterData extends PosterDataBase {
  type: PosterType.Issuer
  data: {
    issuerInfo: IssuerInfoResult
    tokenClasses: IssuerTokenClass[]
  }
}

export interface HolderPosterData extends PosterDataBase {
  type: PosterType.Holder
  data: {
    userInfo: UserResponse
    tokens: NFTToken[]
  }
}

export type Poster = NftPosterData | IssuerPosterData | HolderPosterData

export type PosterProps<T extends Poster> = Pick<T, 'data'> & {
  onLoad: (el: HTMLDivElement) => void
}
