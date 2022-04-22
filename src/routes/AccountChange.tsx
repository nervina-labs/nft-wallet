/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React, { useCallback, useEffect, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGetAndSetAuth, useProfile } from '../hooks/useProfile'
import { useAccount, useAccountStatus, WalletType } from '../hooks/useAccount'
import { RoutePath } from './path'
import {
  useCloseConfirmDialog,
  useConfirmDialog,
} from '../hooks/useConfirmDialog'
import { useWechatShare } from '../hooks/useWechat'

const allowWithoutAuthList = new Set([
  RoutePath.Explore,
  RoutePath.Apps,
  // RoutePath.AddressCollector,
  RoutePath.Claim,
  RoutePath.NotFound,
  RoutePath.Redeem,
  RoutePath.RedeemPrize,
  RoutePath.RedeemResult,
  RoutePath.MyRedeem,
  RoutePath.Login,
  RoutePath.TokenClass,
])

const forceAuthList = new Set([`${RoutePath.Explore}?tag=follow`])

export const AccountChange: React.FC = ({ children }) => {
  const { address, walletType, pubkey } = useAccount()
  const { prevAddress, isLogined } = useAccountStatus()
  const history = useHistory()
  const location = useLocation()
  useEffect(() => {
    if (
      prevAddress &&
      address &&
      prevAddress !== address &&
      walletType &&
      walletType === WalletType.Metamask
    ) {
      history.push(RoutePath.NFTs)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevAddress, address, walletType])
  const { isAuthenticated } = useProfile()
  const getAuth = useGetAndSetAuth()
  const isSigning = useRef(false)
  const onOpenConfirm = useConfirmDialog()
  const onCloseConfirm = useCloseConfirmDialog()
  const [t] = useTranslation('translations')
  const wechatShare = useWechatShare()
  useEffect(() => {
    wechatShare()
    const unlisten = history.listen(() => {
      wechatShare()
    })

    return unlisten
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signForVerify = useCallback(async () => {
    isSigning.current = true
    await onOpenConfirm({
      type: 'text',
      title: t('auth.title'),
      content: t('auth.content'),
      okText: t('auth.ok'),
      onConfirm: async () => {
        try {
          await getAuth()
          if (WalletType.Flashsigner !== walletType) {
            onCloseConfirm()
          }
        } catch (error) {
          onCloseConfirm()
        } finally {
          isSigning.current = false
        }
      },
    })
  }, [getAuth, onCloseConfirm, onOpenConfirm, t, walletType])

  useEffect(() => {
    const pathInForceAuthList = forceAuthList.has(
      location.pathname + location.search
    )
    const pathInAllowList = [...allowWithoutAuthList].some((p) =>
      location.pathname.startsWith(p)
    )
    if (
      isLogined &&
      !isAuthenticated &&
      (!pathInAllowList || pathInForceAuthList) &&
      !isSigning.current
    ) {
      if (
        WalletType.Unipass === walletType ||
        WalletType.Metamask === walletType
      ) {
        signForVerify()
      }
    }
  }, [
    isAuthenticated,
    walletType,
    address,
    location.pathname,
    location.search,
    isLogined,
    pubkey,
    t,
    signForVerify,
  ])

  return <>{children}</>
}
