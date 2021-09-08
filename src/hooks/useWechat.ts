/* eslint-disable @typescript-eslint/no-extraneous-class */
import { useCallback, useState } from 'react'
import { randomString } from '../utils'
import { WxSignConfig } from '../models/wx'
import { useWalletModel } from './useWallet'
import { IS_SAFARI, WECHAT_APP_ID } from '../constants'

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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useWechatLaunchWeapp = () => {
  const [isWechatInited, setIsWechatInited] = useState(false)
  const { api } = useWalletModel()
  const initWechat = useCallback(async () => {
    if (isWechatInited) {
      return
    }
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
        jsApiList: ['chooseImage'],
        openTagList: ['wx-open-launch-weapp'],
      })
      wx.ready(() => {
        setIsWechatInited(true)
        resolve()
      })
      wx.error((err) => {
        setIsWechatInited(false)
        reject(err)
      })
    })
  }, [isWechatInited, api])

  return {
    initWechat,
    isWechatInited,
  }
}
