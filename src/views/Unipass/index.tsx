import React, { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useProfileModel } from '../../hooks/useProfile'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { useWalletModel, WalletType } from '../../hooks/useWallet'
import {
  UnipassAction,
  UnipassResponse,
  UnipassLoginData,
  UnipassSignData,
} from '../../models/unipass'
import { pubkeyToAddress } from '../../pw/UnipassProvider'
import { RoutePath } from '../../routes'

export const Unipass: React.FC = () => {
  const action = useRouteQuery<UnipassAction>('action', UnipassAction.Login)
  const ret = useRouteQuery('unipass_ret', '')
  const unipassInfo: UnipassResponse = JSON.parse(ret)
  const history = useHistory()
  const { setUnipassAccount } = useWalletModel()
  const { setProfile, profile } = useProfileModel()

  const hasAuth = useCallback(
    (addr: string) => {
      if (profile == null) {
        return false
      }
      return !!profile[addr]
    },
    [profile]
  )

  useEffect(() => {
    const { code } = unipassInfo
    switch (action) {
      case UnipassAction.Login: {
        if (code !== 200) {
          history.replace(RoutePath.Login)
          break
        }
        const data = unipassInfo?.data as UnipassLoginData
        const addr = pubkeyToAddress(data.pubkey)
        const pubkey = data.pubkey
        setUnipassAccount({
          email: data.email,
          pubkey,
          address: addr,
          walletType: WalletType.Unipass,
        })
        history.replace(RoutePath.NFTs)
        break
      }
      case UnipassAction.Sign: {
        if (code !== 200) {
          history.replace(RoutePath.NFTs)
          break
        }
        const data = unipassInfo?.data as UnipassSignData
        const addr = pubkeyToAddress(data.pubkey)
        setUnipassAccount({
          pubkey: data.pubkey,
          address: addr,
          walletType: WalletType.Unipass,
        })
        setProfile({
          auth: `0x01${data.sig.replace('0x', '')}`,
        })
        history.replace(RoutePath.NFTs)
        break
      }
      case UnipassAction.SignTx: {
        const data = unipassInfo?.data as UnipassSignData
        history.replace(RoutePath.Transfer, {
          signature: `0x01${data.sig.replace('0x', '')}`,
        })
        break
      }
      default:
        break
    }
  }, [
    unipassInfo,
    action,
    history,
    setProfile,
    setUnipassAccount,
    profile,
    hasAuth,
  ])
  return null
}
