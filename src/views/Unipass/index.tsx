import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSetAccount, WalletType } from '../../hooks/useAccount'
import { useProfile } from '../../hooks/useProfile'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import {
  UnipassAction,
  UnipassResponse,
  UnipassLoginData,
  UnipassSignData,
} from '../../models/unipass'
import { pubkeyToAddress } from '../../pw/UnipassProvider'
import { RoutePath } from '../../routes'
import { UnipassConfig } from '../../utils'

export const Unipass: React.FC = () => {
  const action = useRouteQuery<UnipassAction>('action', UnipassAction.Login)
  const ret = useRouteQuery('unipass_ret', '{}')
  const unipassInfo: UnipassResponse = JSON.parse(ret)
  const history = useHistory()
  const setUnipassAccount = useSetAccount()
  const { setProfile, profile } = useProfile()
  const ps = useRouteQuery('prev_state', '{}')
  const prevState = JSON.parse(ps)
  const redirectUri = useRouteQuery('redirect', '')
  useEffect(() => {
    const { code } = unipassInfo
    switch (action) {
      case UnipassAction.Login: {
        UnipassConfig.clear()
        if (code !== 200 && code !== 401) {
          history.replace(redirectUri || RoutePath.Login)
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
        history.replace(redirectUri || RoutePath.NFTs)
        break
      }
      case UnipassAction.Sign: {
        UnipassConfig.clear()
        if (code !== 200 && code !== 401) {
          history.replace(redirectUri || RoutePath.NFTs)
          break
        }
        const data = unipassInfo?.data as UnipassSignData
        const addr = pubkeyToAddress(data.pubkey)
        setUnipassAccount({
          pubkey: data.pubkey,
          address: addr,
          walletType: WalletType.Unipass,
        })
        if (code === 200) {
          setProfile({
            auth: `0x01${data.sig.replace('0x', '')}`,
          })
        }
        history.replace(redirectUri ?? RoutePath.NFTs)
        break
      }
      case UnipassAction.SignTx: {
        const id = prevState.uuid as string
        if (code !== 200) {
          history.replace(`/transfer/${id}`)
          break
        }
        const data = unipassInfo?.data as UnipassSignData
        history.replace(`/transfer/${id}`, {
          signature: `0x01${data.sig.replace('0x', '')}`,
          prevState,
        })
        break
      }
      case UnipassAction.Redeem: {
        const id = prevState.uuid as string
        const prevPath = prevState.prevPathname as string
        if (code !== 200) {
          history.replace(prevPath)
          break
        }
        const data = unipassInfo?.data as UnipassSignData
        const state: Record<string, string> = {
          signature: `0x01${data.sig.replace('0x', '')}`,
        }
        if (prevState.customData) {
          state.customData = JSON.parse(
            decodeURIComponent(prevState.customData) || '{}'
          )
        }
        history.replace(`${RoutePath.RedeemResult}/${id}`, state)
        break
      }
      case UnipassAction.RedEnvelope: {
        const data = unipassInfo?.data as UnipassSignData
        if (code === 200) {
          history.replace(RoutePath.RedEnvelope, {
            signature: `0x01${data.sig.replace('0x', '')}`,
            prevState,
          })
          break
        }
        history.replace(RoutePath.RedEnvelope, {
          prevState,
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
    prevState,
    redirectUri,
  ])
  return null
}
