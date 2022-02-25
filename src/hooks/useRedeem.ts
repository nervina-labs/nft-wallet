import { Transaction, transformers } from '@lay2/pw-core'
import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router'
import {
  signMessageWithRedirect,
  transactionToMessage,
} from '@nervina-labs/flashsigner'
import {
  CustomRedeemParams,
  CustomRewardType,
  RedeemEventItem,
} from '../models/redeem'
import { RoutePath } from '../routes'
import { generateUnipassRedeemUrl, noop, UnipassConfig } from '../utils'
import {
  useAccount,
  useAPI,
  useSignTransaction,
  WalletType,
} from './useAccount'
import { useConfirmDialog } from './useConfirmDialog'
import { useToast } from './useToast'
import { trackLabels, useTrackClick } from './useTrack'
import { FlashsignerAction } from '../models/flashsigner'

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

export interface TransferState {
  signature?: string
  tx?: Transaction
  customData?: CustomRedeemParams
  id?: string
}

export const useSignRedeem = () => {
  const history = useHistory()
  const api = useAPI()
  const { walletType, pubkey } = useAccount()
  const signTransaction = useSignTransaction()
  const reactLocation = useLocation<TransferState>()
  const confirmDialog = useConfirmDialog()
  const [t] = useTranslation('translations')

  const [isRedeeming, setIsRedeeming] = useAtom(isSigningAtom)
  const toast = useToast()
  const confirmRedeem = useCallback(
    async ({ customData, id, onConfirmError }: ConfirmRedeemProps) => {
      setIsRedeeming(true)
      try {
        const { tx } = await api.getRedeemTransaction(id, walletType)

        if (walletType === WalletType.Flashsigner) {
          const url = `${location.origin}${RoutePath.Flashsigner}`
          UnipassConfig.setRedirectUri(`${RoutePath.RedeemResult}/${id}`)
          const state: Record<string, any> = {
            prevPathname: reactLocation.pathname,
            uuid: id,
          }
          if (customData) {
            state.customData = customData
          }
          signMessageWithRedirect(url, {
            isRaw: false,
            message: transactionToMessage(
              transformers.TransformTransaction(tx) as any
            ),
            extra: {
              ...state,
              action: FlashsignerAction.Redeem,
            },
          })
          return
        }
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
            signTx,
            state
          )
          return
        } else {
          history.replace(`${RoutePath.RedeemResult}/${id}`, {
            tx: signTx,
            customData,
          })
        }
      } catch (error: any) {
        if (error?.response?.data?.code === 1032) {
          toast(t('exchange.not-on-chain'))
          return
        }
        setIsRedeeming(false)
        toast(t('exchange.error'))
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
      toast,
      t,
    ]
  )

  const trackReedeem = useTrackClick('redeem', 'click')

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
      trackReedeem(trackLabels.apps.redeem)
      if (deliverType && deliverType !== CustomRewardType.None) {
        history.replace(
          `${reactLocation.pathname}${reactLocation.search ?? ''}${
            reactLocation.search?.length > 0 ? '&' : '?'
          }deliverType=${deliverType}`,
          item
        )
      } else {
        confirmDialog({
          type: 'warning', // "error" | "success" | "warning" | "info"
          title: willDestroyed
            ? t('exchange.alert.destroy-title')
            : t('exchange.alert.normal-title'),
          description: willDestroyed
            ? t('exchange.alert.destroy-desc')
            : t('exchange.alert.normal-desc'),
          onConfirm: async () => {
            await confirmRedeem({
              id,
              customData,
            })
          },
          onCancel: noop,
        })
      }
    },
    [confirmRedeem, t, confirmDialog, reactLocation, history, trackReedeem]
  )

  return {
    onRedeem,
    confirmRedeem,
    isRedeeming,
  }
}
