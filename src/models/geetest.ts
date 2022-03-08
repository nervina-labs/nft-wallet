export interface GeeTestOptions {
  challenge: string
  validate: string
  seccode: string
}

export interface GeeTestResponse {
  success: number
  gt: string
  challenge: string
  new_captcha: boolean
}
