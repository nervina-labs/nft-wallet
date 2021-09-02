import { ListMeta } from '.'
import { TokenClass } from './class-list'
import { Issuer } from './issuer'

export enum RedeemType {
  NFT = 'nft',
  Other = 'other',
  Blind = 'blind',
}

export enum RedeemStatus {
  Open = 'open',
  Closed = 'closed',
  Ended = 'end',
  Exchanged = 'exchanged',
  Wait = 'wait',
}

export interface RedeemEventItem {
  issuer: Issuer
  tokens: TokenClass[]
  images: string[]
  type: RedeemType
  status: RedeemStatus
  exchanged: number
  total: number
  title: string
  uuid: string
}

export interface RedeemEvents {
  meta: ListMeta
  events: RedeemEventItem[]
}
