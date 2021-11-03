import { NftType, ListMeta } from './nft'
import { VipInfo } from './class-list'

export enum OrderState {
  OrderPlaced = 'order_placed',
  Paid = 'paid',
  Expired = 'expired',
  Closed = 'closed',
  Done = 'done',
  Refunded = 'refunded',
}

export interface PlaceOrderProps {
  product_uuid: string
  product_count: number
  channel: string
  uuid: string
}

export interface IssuerInfo {
  name: string
  avatar_url: string
  uuid: string
}

export interface RawOrder {
  uuid?: string
  product_name?: string
  product_image_url?: string
  product_count?: string
  product_price?: string
  order_amount_total?: string
  currency?: string
  state?: OrderState
  renderer_type?: NftType
  renderer?: string
}

export interface Order extends RawOrder, VipInfo {
  issuer_info?: IssuerInfo
}

export interface OrdersResponse {
  meta: ListMeta
  token_orders: Order[]
}

export interface OrderDetail {
  uuid: string
  product_uuid: string
  product_name: string
  product_image_url: string
  product_count: string
  order_amount_total: string
  currency: string
  state: OrderState
  created_at?: string
  product_price: string
  paid_at?: string
  ckb_address?: string
  product_description?: string
  renderer_type: NftType
  renderer: string
  issuer_info: IssuerInfo
  token_class_uuid: string
}
