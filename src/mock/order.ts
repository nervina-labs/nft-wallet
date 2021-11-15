import { NftType } from '../models'
import { OrderState } from '../models/order'

export const mockOrder = Object.create({
  uuid: 'string',
  product_uuid: 'string',
  product_name:
    '#f48538 Hex Color Codes#f48538 Hex Color Codes#f48538 Hex Color Codes#f48538 Hex Color Codes#f48538 Hex Color Codes',
  product_image_url:
    'https://alifei02.cfp.cn/creative/vcg/400/new/VCG41N1001984424.jpg',
  product_count: '3',
  order_amount_total: 'string',
  currency: '$',
  state: OrderState.OrderPlaced,
  created_at: 'string',
  product_price: '41',
  paid_at: 'string',
  ckb_address: 'string',
  product_description: 'string',
  renderer_type: NftType.Audio,
  renderer: 'string',
  issuer_info: {
    name: '颜色大全',
    avatar_url: 'https://i.imgur.com/AD3MbBi.jpg',
    uuid: 'string',
  },
  token_class_uuid: 'string',
})
