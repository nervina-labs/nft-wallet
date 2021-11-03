import { atom } from 'jotai'
import { useAtomCallback, useUpdateAtom } from 'jotai/utils'
import { useCallback } from 'react'
import { NftType } from '../models'
import { useAPI } from './useAccount'
import { useGetAndSetAuth } from './useProfile'

export interface CurrentOrder {
  price?: string
  currency?: string
  remain?: number
  limit?: number
  type?: NftType
  name?: string
  coverUrl?: string
  productId?: string
}

export enum PaymentChannel {
  AlipayPC = 'alipay_pc_direct',
  AlipayMobile = 'alipay_wap',
  WechatMobile = 'wx_wap',
  Paypal = 'paypal',
}

export const isDrawerOpenAtom = atom(false)
export const currentOrderIdAtom = atom<string | null>(null)
export const currentPayChannelAtom = atom<PaymentChannel>(
  PaymentChannel.AlipayPC
)
export const currentOrderInfoAtom = atom<CurrentOrder>({})

export const useOrderDrawer = () => {
  const setDrawerVisable = useUpdateAtom(isDrawerOpenAtom)
  const openOrderDrawer = useCallback(() => {
    setDrawerVisable(true)
  }, [setDrawerVisable])

  const closeOrderDrawer = useCallback(() => {
    setDrawerVisable(false)
  }, [setDrawerVisable])

  return {
    openOrderDrawer,
    closeOrderDrawer,
  }
}

export const useSubmitOrder = () => {
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const setCurrentId = useUpdateAtom(currentOrderIdAtom)
  return useCallback(async () => {
    const auth = await getAuth()
    const {
      data: { uuid },
    } = await api.submitOrder(auth)
    setCurrentId(uuid)
    return uuid
  }, [api, setCurrentId, getAuth])
}

export interface PlaceOrderProps {
  productId: string
  count: number
  uuid?: string
}

export const usePlaceOrder = () => {
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  return useAtomCallback(
    useCallback(
      async (get, _, { count, productId, uuid }: PlaceOrderProps) => {
        const auth = await getAuth()
        const channel = get(currentPayChannelAtom)
        const { data } = await api.placeOrder(
          {
            product_count: count,
            product_uuid: productId,
            uuid: uuid || (get(currentOrderIdAtom) as string),
            channel,
          },
          auth
        )
        // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
        // @ts-ignore
        const pingxx = await import('pingpp-js')
        return await new Promise<void>((resolve, reject) => {
          pingxx.createPayment(data, function (result: string, err: any) {
            if (result === 'success') {
              resolve()
            } else if (result === 'fail') {
              reject(err)
            } else if (result === 'reject') {
              reject(new Error('reject'))
            }
            reject(new Error('unknown'))
          })
        })
      },
      [api, getAuth]
    )
  )
}
