export type WxSignConfigField = 'nonceStr' & 'url' & 'timestamp'
export interface WxSignConfig {
  nonce_str: string
  url: string
  timestamp: number
}
