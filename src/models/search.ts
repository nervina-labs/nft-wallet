/* eslint-disable @typescript-eslint/indent */
import { VipInfo } from './class-list'
import { ListMeta, PaginationOptions } from '.'

export enum SearchType {
  Issuer = 'issuer',
  TokenClass = 'token_class',
}

export interface SearchOptions extends PaginationOptions {}

export interface SearchIssuer extends VipInfo {
  uuid: string
  name: string
  avatar_url: string
}

export interface SearchTokenClass {
  uuid: string
  name: string
  renderer: string
  bg_image_url: string
}

export interface SearchListMeta extends ListMeta {
  type: SearchType
}

interface SearchResponseMeta {
  meta: SearchListMeta
}

export interface SearchIssuersResponse extends SearchResponseMeta {
  issuers: SearchIssuer[]
}
export interface SearchTokenClassesResponse extends SearchResponseMeta {
  token_classes: SearchTokenClass[]
}

export type SearchResponse<T extends SearchType> = T extends SearchType.Issuer
  ? SearchIssuersResponse
  : T extends SearchType.TokenClass
  ? SearchTokenClassesResponse
  : never
