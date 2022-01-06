/* eslint-disable @typescript-eslint/no-extraneous-class */
import { useCallback } from 'react'
import { randomString } from '../utils'
import { WxSignConfig } from '../models/wx'
import { IS_SAFARI, IS_WEXIN, WECHAT_APP_ID } from '../constants'
import { useAPI } from './useAccount'
import { useRouteMatch } from 'react-router'
import { RoutePath } from '../routes'
import { useTranslation } from 'react-i18next'

export const generateWxConfig = (): WxSignConfig => {
  return {
    url: IS_SAFARI ? IntryUrl.get() : location.href,
    nonce_str: randomString(12),
    timestamp: parseInt((Date.now() / 1000).toString(), 10),
  }
}

export class IntryUrl {
  static url = ''
  static get() {
    return IntryUrl.url
  }

  static set(url: string) {
    if (IntryUrl.url) {
      return
    }
    IntryUrl.url = url
  }
}

export const buildWechatShareData = (data: WechatShareData) => {
  return {
    imgUrl: `${location.origin}/64.png`,
    ...data,
  }
}

export interface WechatShareData {
  title: string
  desc: string
  link: string
  imgUrl?: string
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useInitWechat = () => {
  const api = useAPI()
  const initWechat = useCallback(
    async (cb?: () => void) => {
      const wxSignConfig = generateWxConfig()
      const { data } = await api.getWechatSignature(wxSignConfig)
      const signature = data?.signature
      return await new Promise<void>((resolve, reject) => {
        wx.config({
          debug: false,
          appId: WECHAT_APP_ID,
          signature,
          nonceStr: wxSignConfig.nonce_str,
          timestamp: wxSignConfig.timestamp,
          jsApiList: [
            'updateAppMessageShareData',
            'updateTimelineShareData',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'showMenuItems',
          ],
          openTagList: [],
        })
        wx.ready(() => {
          cb?.()
          resolve()
        })
        wx.error((err) => {
          reject(err)
        })
      })
    },
    [api]
  )

  return initWechat
}

export const useWechatShare = () => {
  const matchNFT = useRouteMatch(RoutePath.NFT)
  const matchClass = useRouteMatch(RoutePath.TokenClass)
  const matchIssuer = useRouteMatch(RoutePath.Issuer)
  const matchCollector = useRouteMatch(RoutePath.Holder)
  const matchHome = useRouteMatch(RoutePath.NFTs)
  const [t] = useTranslation('translations')
  const initWechat = useInitWechat()

  return useCallback(
    async (d?: WechatShareData) => {
      if (!IS_WEXIN) {
        return
      }
      let data = buildWechatShareData({
        title: t('common.share.wx.others.title'),
        desc: t('common.share.wx.others.desc'),
        link: location.href,
      })
      if (
        matchNFT ||
        matchClass ||
        matchIssuer ||
        matchCollector ||
        matchHome
      ) {
        if (d) {
          data = buildWechatShareData(d)
        }
      }
      wx.updateAppMessageShareData(data)
      wx.updateTimelineShareData(data)
      initWechat(() => {
        wx.showMenuItems({
          menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline'],
        })
        if (wx.onMenuShareAppMessage) {
          wx.onMenuShareAppMessage(data)
          wx.onMenuShareTimeline(data)
        }
      })
    },
    [
      t,
      matchNFT,
      matchClass,
      matchIssuer,
      matchCollector,
      matchHome,
      initWechat,
    ]
  )
}
