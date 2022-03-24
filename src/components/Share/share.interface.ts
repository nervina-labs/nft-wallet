import { ReactNode } from 'react'
import { HolderProps } from './components/posters/holder'
import { IssuerProps } from './components/posters/issuer'
import { NftProps } from './components/posters/nft'

export type PosterOnLoaded = (el: HTMLDivElement) => void

export interface PosterProps {
  onLoaded: PosterOnLoaded
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

export type PosterFn = (onLoaded: PosterOnLoaded) => ReactNode

export interface ShareProps {
  isOpen: boolean
  onClose: () => void
  shareUrl: string
  poster?: DefaultPoster | PosterFn
  reloadByRoute?: boolean
}

export type DefaultPoster = NftPoster | IssuerPoster | HolderPoster
