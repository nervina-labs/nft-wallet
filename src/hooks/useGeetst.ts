/* eslint-disable camelcase */
import { atom, useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Query } from '../models/query'
import { noop } from '../utils'
import { useAPI } from './useAccount'
import { useConfirmDialog } from './useConfirmDialog'

export const captchaAtom = atom<any>(null)

export const useGeeTest = (
  selector: string,
  enabled = true,
  onSuccess: (captcha: any) => any = noop
) => {
  const [isReady, setIsReady] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [captcha, setCaptcha] = useAtom(captchaAtom)
  const confirmDialog = useConfirmDialog()
  const { t, i18n } = useTranslation('t')
  const api = useAPI()

  useQuery(
    [Query.InitGeeTest, i18n.language, api, enabled],
    async () => {
      const { data } = await api.initGeeTest()
      return data
    },
    {
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      onSuccess({ success, gt, challenge, new_captcha }) {
        ;(window as any).initGeetest(
          {
            gt,
            challenge,
            new_captcha,
            offline: !success,
            product: 'float',
            width: '100%',
            lang: i18n.language === 'zh' ? 'zh-cn' : 'en',
          },
          (captchaObj: any) => {
            captchaObj.appendTo(selector)
            captchaObj
              .onReady(() => {
                setCaptcha(captchaObj)
                setIsReady(true)
              })
              .onSuccess(async () => {
                setIsSuccess(true)
                await onSuccess?.(captchaObj)
              })
              .onError(() => {
                confirmDialog({
                  type: 'error',
                  title: t('common.geetest-error'),
                })
                setIsSuccess(false)
              })
          }
        )
      },
    }
  )

  return {
    isReady,
    isSuccess,
    captcha,
    setIsSuccess,
  }
}

export const useCaptcha = () => useAtomValue(captchaAtom)
