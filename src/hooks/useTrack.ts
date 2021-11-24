import { noop } from '../utils'
import { useDidMount } from './useDidMount'

export const categories = {
  login: '秘宝-登录页',
  explore: '秘宝-首页',
  'explore-slider': '秘宝-首页-轮播图',
  'explore-banner': '秘宝-首页-固定banner位',
  'explore-recommend': '秘宝-首页-轮播图',
  'go-nft-from-explore-recommend': '首页-推荐模块-点击进入NFT详情页',
  'explore-rank': '秘宝-首页-排行榜模块',
  'explore-rank-nft-hot': '秘宝-首页-排行榜模块-热门作品榜单页',
  'explore-rank-nft-sell': '秘宝-首页-排行榜模块-畅销作品榜单页',
  'explore-rank-issuer-hot': '秘宝-首页-排行榜模块-热门创作者榜单页',
  'explore-rank-issuer-sell': '秘宝-首页-排行榜模块-畅销创作者榜单页',
  'go-nft-from-explore-rank-nft-hot':
    '秘宝-首页-排行榜模块-热门作品榜单页-点击进入NFT详情页',
  'go-nft-from-explore-rank-nft-sell':
    '秘宝-首页-排行榜模块-畅销作品榜单页-点击进入NFT详情页',
  'go-nft-from-explore-rank-issuer-hot':
    '秘宝-首页-排行榜模块-热门创作者榜单页-点击进入NFT详情页',
  'go-nft-from-explore-rank-issuer-sell':
    '秘宝-首页-排行榜模块-畅销创作者榜单页-点击进入NFT详情页',
  'explore-explore': '秘宝-首页-探索模块',
  'explore-follow': '秘宝-首页-关注模块',
  'go-nft-from-explore-explore': '秘宝-首页-探索模块-点击进入NFT详情页',
  'go-nft-from-explore-follow': '秘宝-首页-关注模块-点击进入NFT详情页',
  narbar: '秘宝-底部工具栏',
  home: '秘宝-个人中心',
  'go-nft-from-home-holder': '秘宝-个人中心-持有-点击进入NFT',
  'go-nft-from-home-like': '秘宝-个人中心-赞过-点击进入NFT',
  'go-issuer-from-home-follow': '秘宝-个人中心-关注-点击进入创作者主页',
  'home-icon': '秘宝-个人中心-设置',
  orders: '秘宝-我的订单',
  'order-detail': '秘宝-我的订单-订单详情页',
  'nft-detail': '秘宝-秘宝详情页',
  'nft-detail-cardback': '秘宝-秘宝详情页-卡背',
  'nft-detail-follow': '秘宝-秘宝详情页-关注创作者',
  issuer: '秘宝-创作者主页',
  'issuer-follow': '秘宝-创作者主页-关注创作者',
  'go-nft-from-issuer': '秘宝-创作者主页-已创作-点击进入NFT',
  'go-nft-from-issuer-on-sell': '秘宝-创作者主页-在售-点击进入NFT',
  'issuer-on-sell': '秘宝-创作者主页-在售',
  collector: '秘宝-收藏者主页',
  'go-nft-from-collector-holder': '秘宝-个人中心-持有-点击进入NFT',
  'go-nft-from-collector-like': '秘宝-个人中心-赞过-点击进入NFT',
  'go-issuer-from-collector-follow': '秘宝-个人中心-关注-点击进入创作者页面',
  apps: '秘宝-应用页',
  redeem: '秘宝-应用页-兑换页',
  'redeem-detail': '兑换活动详情页',
}

export const actions = {
  didmount: '浏览',
  click: '点击',
  switchover: '切换',
  like: '点赞',
}

export const trackLabels = {
  login: {
    unipass: '通过unipass登录',
    eth: '通过以太坊环境登录',
  },
  explore: {
    lite: 'lite',
    'recommend-to-nft': '点击推荐模块进入NFT详情页',
    'to-nft': '点击进入NFT详情页',
    'to-issuer': '点击进入创作者主页',
    'switch-follow': '切换关注',
    'switch-hot': '最热',
    'switch-on-sell': '在售',
    'switch-new': '最新',
  },
  navbar: {
    explore: '探索',
    categories: '分类',
    home: '个人中心',
    apps: '应用',
  },
  home: {
    explore: '探索',
    switch: {
      hold: '持有',
      like: '赞过',
      follow: '关注',
    },
    'to-nft': '点击进入NFT详情页',
    'to-issuer': '点击进入创作者个人主页',
    copy: '复制CKB地址',
    qrcode: '点击二维码',
    settings: '设置',
    orders: '我的订单',
    profile: '个人资料',
    txs: '交易记录',
    language: '语言设置',
    help: '帮助支持',
    logout: '退出登录',
  },
  orders: {
    switch: {
      all: '全部',
      wait: '待付款',
      sending: '发送中',
      received: '已接收',
    },
    help: '客户按钮',
  },
  nftDetail: {
    check: '查看',
    share: '分享',
    switch: {
      desc: '简介',
      tx: '流转历史',
      collector: '收藏者',
    },
    like: '点赞',
    buy: '购买',
  },
  issuer: {
    switch: {
      creartor: '已创作',
      onsell: '在售',
    },
    share: '分享',
    follow: '关注',
    'to-nft': '点击进入NFT',
    like: '点赞',
  },
  collector: {
    switch: {
      hold: '持有',
      like: '赞过',
      follow: '关注',
    },
    share: '分享',
    'to-nft': '点击进入NFT',
    'to-issuer': '点击进入创作者个人主页',
  },
  apps: {
    redeem: '兑换',
    pocket: 'unipass红包',
    ticket: 'unipass门票',
    dao: '秘DAO',
    hall: '虚拟展厅',
    vip: 'VIP社区',
    'redeem-event': '兑换活动',
    'redeem-click': '兑换',
  },
}

export type TrackCategory = keyof typeof categories
export type TrackAction = keyof typeof actions
export type TrackLabel = string | undefined | number

if (process.env.NODE_ENV === 'development') {
  ;(window as any)._czc = {
    push: (args: any[]) => {
      console.log(args)
    },
  }
}

export const umengTrack = (
  category: TrackCategory,
  action: TrackAction,
  label?: TrackLabel
) => {
  try {
    // if (process.env.NODE_ENV === 'development') return
    const args: any[] = [
      '_trackEvent',
      categories[category] || category,
      actions[action],
    ]
    if (label) {
      args.push(label)
    }
    ;(window as any)._czc.push(args)
  } catch {
    // ignore
  }
}

export const useTrackDidMount = (
  category: TrackCategory,
  label?: TrackLabel
) => {
  useDidMount(() => {
    umengTrack(category, 'didmount', label)
  })
}

export const useTrackEvent = (
  category: TrackCategory,
  action: TrackAction,
  label?: TrackLabel,
  cb: Function = noop
) => {
  return async (e?: any) => {
    await cb?.(e)
    umengTrack(category, action, label)
  }
}

export const useTrackClick = (
  category: TrackCategory,
  action: TrackAction,
  cb: Function = noop
) => {
  return async (label?: TrackLabel) => {
    umengTrack(category, action, label)
  }
}

export const trackRank = (
  page: string,
  action: TrackAction,
  label?: TrackLabel
) => {
  const cat = `秘宝-首页-排行榜模块-${page}单页` as any
  umengTrack(cat, action, label)
}
