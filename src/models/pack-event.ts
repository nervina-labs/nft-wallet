import { ListMeta } from './nft'

export enum PackEventState {
  Pending = 'pending',
  Completed = 'completed',
}

export interface PackEventListRecord {
  pack_event_info: {
    uuid: string
    name: string
    cover_image_url: string
    pack_options_count: number
    is_banned: boolean
  }
  state: PackEventState
  record_items_count: number
}

export interface PackEventListResponse {
  pack_event_records: PackEventListRecord[]
  meta: ListMeta
}
