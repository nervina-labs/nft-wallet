export enum OrderState {
  All = 'all',
  Wait = 'order_placed',
  Submitting = 'submitting',
  Done = 'done',
}

export interface PlaceOrderProps {
  product_uuid: string
  product_count: string
  channel: string
  uuid: string
}
