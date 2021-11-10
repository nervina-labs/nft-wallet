import { HolderProps } from './components/posters/holder'
import { IssuerProps } from './components/posters/issuer'
import { NftProps } from './components/posters/nft'

export interface PosterProps {
  onLoaded: (el: HTMLDivElement) => void
  shareUrl?: string
}

export enum PosterType {
  Nft = 'nft',
  Issuer = 'issuer',
  Holder = 'holder',
}

export interface NftPoster {
  type: PosterType.Nft
  data: NftProps
}

export interface IssuerPoster {
  type: PosterType.Issuer
  data: IssuerProps
}

export interface HolderPoster {
  type: PosterType.Holder
  data: HolderProps
}

export interface ShareProps {
  isOpen: boolean
  onClose: () => void
  shareUrl: string
  poster?: NftPoster | IssuerPoster | HolderPoster
}
