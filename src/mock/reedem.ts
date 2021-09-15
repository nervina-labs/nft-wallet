import { RedeemStatus, RedeemType, UserRedeemState } from '../models/redeem'

const token = {
  class_bg_image_url:
    'https://oss.jinse.cc/development/f1c8f297-2039-4a77-9861-fca4e5b25035.png',
  class_name: 'prize',
  class_total: 6,
  item_count: 8,
  class_card_back_content_exist: true,
  renderer_type: 'audio',
}

const item = {
  issuer_info: {
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
  reward_info: [token, token, token, token],
  type: RedeemType.Blind,
  uuid: Math.random(),
  name: 'fucsancksa',
  descrition: 'NFT type redeem',
  reward_type: RedeemType.NFT,
  progress: {
    total: 48,
    claimed: 24,
  },
  state: RedeemStatus.Open,
  user_redeemed_info: {
    state: UserRedeemState.NotAllow,
    redeemd_reward_uuid: 'prize',
  },
}

const otherItem = {
  issuer_info: {
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
  reward_info: [token, token, token, token],
  uuid: Math.random(),
  name: 'fucsancksa',
  descrition: 'NFT type redeem',
  reward_type: RedeemType.Other,
  progress: {
    total: 48,
    claimed: 24,
  },
  state: RedeemStatus.Open,
  user_redeemed_info: {
    state: UserRedeemState.WaittingRedeem,
    redeemd_reward_uuid: 'prize',
  },
}

export const mockRedeemDetail: any = {
  event_info: otherItem,
  reward_info: otherItem.reward_info,
  issuer_info: otherItem.issuer_info,
  timestamp: (Date.now() / 1000).toString(),
  rule_info: {
    rule_type: 'token',
    will_destroyed: true,
    options: [
      {
        class_bg_image_url:
          'https://oss.jinse.cc/development/f1c8f297-2039-4a77-9861-fca4e5b25035.png',
        class_name: 'string',
        class_total: 'string',
        item_count: 4,
        item_owned_count: 3,
      },
      {
        class_bg_image_url:
          'https://oss.jinse.cc/development/f1c8f297-2039-4a77-9861-fca4e5b25035.png',
        class_name: 'string',
        class_total: 'string',
        item_count: 1,
        item_owned_count: 1,
      },
      {
        class_bg_image_url:
          'https://oss.jinse.cc/development/f1c8f297-2039-4a77-9861-fca4e5b25035.png',
        class_name: 'string',
        class_total: 'string',
        item_count: 1,
        item_owned_count: 3,
      },
      {
        class_bg_image_url:
          'https://oss.jinse.cc/development/f1c8f297-2039-4a77-9861-fca4e5b25035.png',
        class_name: 'string',
        class_total: 'string',
        item_count: 3,
        item_owned_count: 1,
      },
    ],
  },
}

export const mockRedeems: any[] = [item, item, item, otherItem]
