/* eslint-disable @typescript-eslint/indent */
import { atom } from 'jotai'
import {
  useAtomCallback,
  useAtomValue,
  useUpdateAtom,
  selectAtom,
  useResetAtom,
  atomWithReset,
  atomWithStorage,
} from 'jotai/utils'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import {
  interval,
  switchMap,
  filter,
  take,
  lastValueFrom,
  timeout,
  tap,
} from 'rxjs'
import {
  IS_ANDROID,
  IS_CHROME,
  IS_DESKTOP,
  IS_WEBKIT,
  IS_WEXIN,
} from '../constants'
import { NftType, Query } from '../models'
import { OrderState } from '../models/order'
import { formatCurrency } from '../utils'
import { useAPI } from './useAccount'
import { useConfirmDialog } from './useConfirmDialog'
import { useGetAndSetAuth } from './useProfile'

export interface CurrentOrder {
  price?: string
  currency?: string
  remain?: number
  limit?: number | null
  type?: NftType
  name?: string
  coverUrl?: string
  hasCardback?: boolean
}

export enum PaymentChannel {
  AlipayPC = 'alipay_pc_direct',
  AlipayMobile = 'alipay_wap',
  WechatMobile = 'wx_wap',
  WechatPub = 'wx_pub',
  Paypal = 'paypal',
  WechatScan = 'wx_pub_qr',
}

export enum OrderStep {
  Init = 0,
  PaymentChannel = 1,
  ConfirmOrder = 2,
  Reselect = 3,
}

export interface PlaceOrderProps {
  productId?: string
  count?: number
  uuid?: string
  channel?: PaymentChannel
}

export const isDrawerOpenAtom = atom(false)
export const currentOrderInfoAtom = atomWithReset<CurrentOrder>({})
export const orderStepAtom = atomWithReset<OrderStep>(OrderStep.Init)
export const placeOrderPropsAtom = atomWithReset<PlaceOrderProps>({})
export const isWechatAuthedAtom = atomWithStorage('mibao_wechat_auth', false)
export const isWechatScanModalOpenAtom = atom(false)
export const wechatPaymentQrCodeAtom = atom('')

export const useOrderStep = () => {
  return useAtomValue(orderStepAtom)
}

export const useCloseWechatScanModal = () => {
  const setIsWechatScanModalOpen = useUpdateAtom(isWechatScanModalOpenAtom)
  return useCallback(() => {
    setIsWechatScanModalOpen(false)
  }, [setIsWechatScanModalOpen])
}

export const useSetOrderStep = () => {
  return useUpdateAtom(orderStepAtom)
}

const useSetProps = () => {
  return useUpdateAtom(placeOrderPropsAtom)
}

export const useResetOrderState = () => {
  const resetInfo = useResetAtom(currentOrderInfoAtom)
  const resetStep = useResetAtom(orderStepAtom)
  const resetProps = useResetAtom(placeOrderPropsAtom)

  return () => {
    resetInfo()
    resetStep()
    resetProps()
  }
}

export const useSetProductId = () => {
  const setProps = useSetProps()
  return useCallback(
    (productId: string) => {
      setProps((p) => {
        return {
          ...p,
          productId,
        }
      })
    },
    [setProps]
  )
}
export const useSetProductCount = () => {
  const setProps = useSetProps()
  return useCallback(
    (count: number) => {
      setProps((p) => {
        return {
          ...p,
          count,
        }
      })
    },
    [setProps]
  )
}

export const useSetUUID = () => {
  const setProps = useSetProps()
  return useCallback(
    (uuid: string) => {
      setProps((p) => {
        return {
          ...p,
          uuid,
        }
      })
    },
    [setProps]
  )
}

const uuidAtom = selectAtom(placeOrderPropsAtom, (p) => p.uuid)

export const useCurrentUUID = () => {
  return useAtomValue(uuidAtom)
}

export const useSetChannel = () => {
  const setProps = useSetProps()
  return useCallback(
    (channel: PaymentChannel) => {
      setProps((p) => {
        return {
          ...p,
          channel,
        }
      })
    },
    [setProps]
  )
}

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
  const setUUID = useSetUUID()
  return useCallback(async () => {
    const auth = await getAuth()
    const {
      data: { uuid },
    } = await api.submitOrder(auth)
    setUUID(uuid)
  }, [api, setUUID, getAuth])
}

export const usePlaceOrder = () => {
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const { closeOrderDrawer } = useOrderDrawer()
  const closeWechatModal = useCloseWechatScanModal()
  return useAtomCallback(
    useCallback(
      async (get, set) => {
        const auth = await getAuth()
        const { uuid = '', channel, productId, count } = get(
          placeOrderPropsAtom
        )
        const { data } = await (productId
          ? api.placeOrder(
              {
                product_count: count,
                product_uuid: productId,
                uuid,
                channel,
              },
              auth
            )
          : api.continuePlaceOrder(uuid, channel as string, auth))
        // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
        // @ts-ignore
        const pingxx = await import('pingpp-js')
        if (channel === PaymentChannel.AlipayMobile && IS_WEXIN) {
          pingxx.setAPURL(`${location.origin}/alipay.htm`)
        }
        if (channel === PaymentChannel.WechatScan) {
          set(wechatPaymentQrCodeAtom, JSON.parse(data).credential.wx_pub_qr)
          set(isWechatScanModalOpenAtom, true)
          closeOrderDrawer()
          set(orderStepAtom, OrderStep.Init)
          return await lastValueFrom(
            // polling for every 5 seconds
            interval(5000).pipe(
              switchMap(async () => {
                const isModalOpen = get(isWechatScanModalOpenAtom)
                if (!isModalOpen) {
                  throw new Error('modal close')
                }
                return await api.getOrderDetail(uuid as string, auth)
              }),
              filter((res) => {
                const state = res.data.token_order.state
                return state === OrderState.Paid || state === OrderState.Done
              }),
              take(1),
              // timeout for 5 minutes
              timeout(3e5),
              tap(() => {
                set(isWechatScanModalOpenAtom, false)
              })
            )
          ).then(() => uuid)
        }
        if (!IS_WEXIN && IS_WEBKIT) {
          pingxx.setUrlReturnCallback(
            function (err: any, url: string) {
              if (err) {
                throw new Error('unknown')
              }
              location.href = url
              closeOrderDrawer()
              set(orderStepAtom, OrderStep.Init)
            },
            [PaymentChannel.AlipayMobile]
          )
        }
        if (
          channel === PaymentChannel.WechatMobile &&
          !IS_WEXIN &&
          IS_CHROME &&
          IS_ANDROID
        ) {
          pingxx.setUrlReturnCallback(
            function (err: any, url: string) {
              if (err) {
                throw new Error('unknown')
              }
              location.replace(url)
              closeOrderDrawer()
              set(orderStepAtom, OrderStep.Init)
            },
            [PaymentChannel.WechatMobile]
          )
        }
        return await new Promise<string>((resolve, reject) => {
          pingxx.createPayment(data, function (result: string, err: any) {
            if (result === 'success') {
              closeOrderDrawer()
              closeWechatModal()
              resolve(uuid)
            } else if (result === 'fail') {
              reject(err)
            } else if (result === 'reject' || result === 'cancel') {
              reject(new Error('reject'))
            }
            reject(new Error('unknown'))
          })
        })
      },
      [api, getAuth, closeOrderDrawer, closeWechatModal]
    )
  )
}

export const useDeleteOrder = () => {
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const confirmDialog = useConfirmDialog()
  const [t] = useTranslation('translations')
  const qc = useQueryClient()
  return useCallback(
    async (
      uuid: string,
      continueOrder: (
        e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => void
    ) => {
      confirmDialog({
        type: 'warning',
        title: t('orders.dialog.delete-title'),
        description: t('orders.dialog.delete-desc'),
        okText: t('orders.dialog.delete-confirm'),
        cancelText: t('orders.dialog.delete-quit'),
        onConfirm: () => {
          requestAnimationFrame(() => continueOrder())
        },
        onCancel: async () => {
          const auth = await getAuth()
          await api.deleteOrder(uuid, auth)
          qc.refetchQueries(Query.OrderList)
        },
      })
    },
    [api, getAuth, confirmDialog, t, qc]
  )
}

export interface ContinueOrderProps {
  uuid: string
  price: string
  count: number
  currency: string
  channel?: PaymentChannel
}

export const useContinueOrder = () => {
  const setDrawerVisable = useUpdateAtom(isDrawerOpenAtom)
  const setProps = useSetProps()
  const setOrderInfo = useUpdateAtom(currentOrderInfoAtom)
  const setStep = useSetOrderStep()
  return useCallback(
    ({ uuid, price, count, currency, channel }: ContinueOrderProps) => {
      setOrderInfo({
        price,
        currency,
      })
      setProps({
        count,
        uuid,
        channel: channel || PaymentChannel.Paypal,
      })
      setDrawerVisable(true)
      setStep(OrderStep.ConfirmOrder)
    },
    [setOrderInfo, setProps, setDrawerVisable, setStep]
  )
}

export const useOrderPrice = () => {
  const order = useAtomValue(currentOrderInfoAtom)
  const orderProps = useAtomValue(placeOrderPropsAtom)
  const [prime, decimal] = useMemo(() => {
    const price = order.price
    const count = orderProps.count
    const tp = formatCurrency(Number(price) * Number(count), order.currency)
    return tp.split('.')
  }, [order, orderProps])

  return {
    prime,
    decimal,
  }
}
