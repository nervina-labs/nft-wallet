export enum PosterType {
  Nft = 'nft',
  Issuer = 'issuer',
  Account = 'account',
}
export interface NftPoster {
  type: PosterType.Nft
  data: {
    img: string
    creator: string
    serial: number
    limit: number
  }
}
