/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React, { useEffect, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGetAndSetAuth, useProfile } from '../hooks/useProfile'
import { UnipassConfig } from '../utils'
import { useAccount, useAccountStatus, WalletType } from '../hooks/useAccount'
import { RoutePath } from './path'
import {
  useCloseConfirmDialog,
  useConfirmDialog,
} from '../hooks/useConfirmDialog'

const allowWithoutAuthList = new Set([
  RoutePath.Unipass,
  RoutePath.Explore,
  RoutePath.Apps,
  RoutePath.AddressCollector,
  RoutePath.Claim,
  RoutePath.NotFound,
  RoutePath.Redeem,
  RoutePath.RedeemPrize,
  RoutePath.RedeemResult,
  RoutePath.MyRedeem,
  RoutePath.Login,
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
      walletType !== WalletType.Unipass
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
        (WalletType.Unipass === walletType && pubkey) ||
        WalletType.Metamask === walletType
      ) {
        isSigning.current = true
        onOpenConfirm({
          type: 'text',
          title: t('auth.title'),
          content: t('auth.content'),
          okText: t('auth.ok'),
          onConfirm: () => {
            if (pathInForceAuthList && WalletType.Unipass === walletType) {
              UnipassConfig.setRedirectUri(location.pathname + location.search)
            }
            getAuth()
              .then(() => {
                if (WalletType.Metamask === walletType) {
                  onCloseConfirm()
                }
              })
              .catch(Boolean)
          },
        })
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
    getAuth,
    onOpenConfirm,
    onCloseConfirm,
  ])

  return <>{children}</>
}
