import { Transaction } from '@lay2/pw-core'
import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation, useParams } from 'react-router'
import {
  CustomRedeemParams,
  CustomRewardType,
  RedeemEventItem,
} from '../models/redeem'
import { RoutePath } from '../routes'
import { generateUnipassRedeemUrl, UnipassConfig } from '../utils'
import { useProfileModel } from './useProfile'
import { useWalletModel, WalletType } from './useWallet'
import { useWarning } from './useWarning'

export interface onRedeemProps {
  deliverType?: CustomRewardType
  id: string
  isAllow: boolean
  willDestroyed: boolean
  customData?: CustomRedeemParams
  item?: RedeemEventItem
}

export interface ConfirmRedeemProps {
  id: string
  customData?: CustomRedeemParams
  onConfirmError?: () => any
}

const isSigningAtom = atom(false)
const isSendingAtom = atom(false)

export interface TransferState {
  signature?: string
  tx?: Transaction
  customData?: CustomRedeemParams
}

export const useSignRedeem = () => {
  const history = useHistory()
  const { api, walletType, signTransaction, pubkey } = useWalletModel()
  const reactLocation = useLocation<TransferState>()
  const warning = useWarning()
  const [t] = useTranslation('translations')

  const [isRedeeming, setIsRedeeming] = useAtom(isSigningAtom)
  const { snackbar } = useProfileModel()
  const confirmRedeem = useCallback(
    async ({ customData, id, onConfirmError }: ConfirmRedeemProps) => {
      setIsRedeeming(true)
      try {
        const { tx } = await api
          .getRedeemTransaction(id, walletType === WalletType.Unipass)
          .catch((err) => {
            throw new Error(err)
          })

        const signTx = await signTransaction(tx).catch((err) => {
          throw new Error(err)
        })

        if (walletType === WalletType.Unipass) {
          const url = `${location.origin}${RoutePath.Unipass}`
          UnipassConfig.setRedirectUri(`${RoutePath.RedeemResult}/${id}`)
          const state: Record<string, string> = {
            prevPathname: reactLocation.pathname,
            uuid: id,
          }
          if (customData) {
            state.customData = encodeURIComponent(JSON.stringify(customData))
          }
          location.href = generateUnipassRedeemUrl(
            url,
            url,
            pubkey,
            signTx as any,
            state
          )
          return
        } else {
          history.push(`${RoutePath.RedeemResult}/${id}`, {
            tx: signTx,
            customData,
          })
        }
      } catch (error) {
        setIsRedeeming(false)
        snackbar(t('exchange.error'))
        await onConfirmError?.()
      }
    },
    [
      api,
      history,
      pubkey,
      signTransaction,
      walletType,
      reactLocation.pathname,
      setIsRedeeming,
      snackbar,
      t,
    ]
  )

  const onRedeem = useCallback(
    ({
      deliverType,
      id,
      isAllow,
      willDestroyed,
      customData,
      item,
    }: onRedeemProps) => {
      if (!isAllow) {
        return
      }
      if (deliverType && deliverType !== CustomRewardType.None) {
        history.push(
          `${reactLocation.pathname}${reactLocation.search ?? ''}${
            reactLocation.search?.length > 0 ? '&' : '?'
          }deliverType=${deliverType}`,
          item
        )
      } else {
        warning(
          t(`exchange.warning${willDestroyed ? '-destroyed' : ''}`),
          async function () {
            await confirmRedeem({
              id,
              customData,
            })
          }
        )
      }
    },
    [confirmRedeem, t, warning, reactLocation, history]
  )

  return {
    onRedeem,
    confirmRedeem,
    isRedeeming,
  }
}

export const useSendRedeem = () => {
  const { api } = useWalletModel()
  const reactLocation = useLocation<TransferState>()

  const [isSending, setIsSending] = useAtom(isSendingAtom)
  const { id } = useParams<{ id: string }>()
  const sendRedeemTransaction = useCallback(async () => {
    const { tx, customData, signature } = reactLocation.state
    try {
      if (tx) {
        await api.redeem({ tx, uuid: id, customData })
      }
      if (signature) {
        const { tx } = await api.getRedeemTransaction(id, true)
        await api.redeem({ tx, uuid: id, customData, sig: signature })
      }
    } catch (error) {
      //
    }
    setIsSending(true)
  }, [api, reactLocation.state, id, setIsSending])

  return {
    isSending,
    sendRedeemTransaction,
  }
}
