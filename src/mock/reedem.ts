import { RedeemStatus, RedeemType } from '../models/redeem'

const token = {
  bg_image_url:
    'https://oss.jinse.cc/development/f1c8f297-2039-4a77-9861-fca4e5b25035.png',
  card_back_content_exist: true,
  class_liked: true,
  class_likes: 1,
  description: '',
  name: 'webm',
  product_qr_code: null,
  renderer:
    'https://oss.jinse.cc/development/01861538-d5b2-4059-9e16-bac443b5ea71.webm',
  renderer_type: 'video',
  uuid: Math.random(),
}

const item = {
  issuer: {
    avatar_url:
      'https://oss.jinse.cc/production/d58e3110-f84f-4c07-9dd8-6a41c72261d1.jpg',
    bg_image_url:
      'https://oss.jinse.cc/production/e5dd0cdf-4913-474c-8c95-a42da5981cf8.jpeg',
    description: 'Join Discord with us: https://discord.com/invite/EZUduaFDg9',
    issuer_followed: false,
    issuer_follows: 51,
    issuer_likes: 40,
    name: "People's Punk",
    uuid: 'd56830ba-4562-4a5d-95d2-4c135dec85ee',
  },
  tokens: [token, token, token, token],
  type: RedeemType.Blind,
  images: [],
  status: RedeemStatus.Open,
  exchanged: 24,
  total: 48,
  title: '👻🌻k1-test ε≡٩(๑>₃<)۶ 空 空 空13',
  uuid: Math.random(),
}

export const mockRedeems: any[] = [item, item, item, item]
