/* eslint-disable @typescript-eslint/indent */
import { ListMeta, PaginationOptions } from '.'
import { VipInfo } from './class-list'

export type SearchType = 'issuer' | 'token_class'
export type SearchListMetaType = 'issuer' | 'token' | null

export interface SearchOptions extends PaginationOptions {
  type?: SearchType
  isUuid?: boolean
}

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
  type: SearchListMetaType
}

export interface SearchReturn {
  meta: SearchListMeta
  issuer_list: SearchIssuer[]
  token_class_list: SearchTokenClass[]
}

export interface SearchIssuerIdReturn {
  issuer: {
    uuid: string
  }
}

export interface SearchTokenClassIdReturn {
  token_class: {
    uuid: string
  }
}

export type SearchUuidReturn = SearchIssuerIdReturn | SearchTokenClassIdReturn

interface IsSearchUuid {
  isUuid: true
}

export type SearchResponse<O extends SearchOptions> = O extends IsSearchUuid
  ? SearchUuidReturn
  : SearchReturn
